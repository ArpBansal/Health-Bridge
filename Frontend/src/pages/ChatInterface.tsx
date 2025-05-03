import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  LogOut, 
  PlusCircle, 
  Send, 
  User, 
  Loader2, 
  ChevronLeft,
  MessageSquare,
  AlertCircle,
  Shield,
  Bot,
  Sparkles,
  Clock,
  ArrowRight,
  Trash2,
  MoreVertical,
  Settings,
  HelpCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import Header from "@/components/Header"

// Updated interface to match Django models
interface Message {
  id: string;
  chat: string;
  sender: number;       // User ID
  content: string;      // User message
  response: string;     // AI response
  timestamp: string;
  role?: string;        // Added role field to handle WebSocket messages
}

interface Chat {
  id: string;
  user: string;
  created_at: string;
  messages: Message[];
}

const ChatInterface: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingChat, setDeletingChat] = useState(false);
  
  // Enhanced animation states
  const [isThinking, setIsThinking] = useState(false);  // AI is processing but not yet streaming
  const [isStreaming, setIsStreaming] = useState(false); // AI is streaming a response
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isThinking, isStreaming]);

  // Auto-focus the input field when active chat changes
  useEffect(() => {
    if (activeChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChat]);

  // Connect to WebSocket when activeChat changes
  useEffect(() => {
    if (activeChat?.id && activeChat.id !== activeChatIdRef.current) {
      activeChatIdRef.current = activeChat.id;
      fetchChatMessages(activeChat.id); // Fetch messages first
      connectWebSocket(activeChat.id);
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        activeChatIdRef.current = null;
      }
    };
  }, [activeChat?.id]);

  // Fetch chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://health-bridge-mtzy.onrender.com/ai/chats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      
      const data = await response.json();
      setChats(data);
      
      // If we have chats and no active chat, set the first one as active
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${chatId}/messages/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      
      const messages = await response.json();
      console.log('Fetched messages:', messages);
      
      // Update the active chat with the fetched messages
      setActiveChat(prevChat => {
        if (!prevChat || prevChat.id !== chatId) return prevChat;
        return {
          ...prevChat,
          messages: messages
        };
      });
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      setDeletingChat(true);
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${chatId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      // Remove the deleted chat from the state
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      
      if (activeChat?.id === chatId) {
        // Set the first available chat as active, or null if none available
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
      }
      
      // Clear the confirmation dialog
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setDeletingChat(false);
    }
  };

  const createNewChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://health-bridge-mtzy.onrender.com/ai/chats/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      
      const newChat = await response.json();
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (chatId: string) => {
    // Don't reconnect if already connected to this chat
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeChatIdRef.current === chatId) {
      console.log('Already connected to this chat, skipping reconnection');
      return;
    }
    
    // Close any existing connection
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection');
      wsRef.current.close();
    }
    
    setConnecting(true);
    setConnectionError(null);
    
    // Connect to WebSocket with the correct URL format
    const token = localStorage.getItem('accessToken');
    console.log('Connecting with token:', token);
    const ws = new WebSocket(`wss://health-bridge-mtzy.onrender.com/ws/chat/${chatId}/?token=${encodeURIComponent(token)}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected to chat:', chatId);
      setConnected(true);
      setConnecting(false);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'connection_established':
            console.log('Connection established for chat:', data.chat_id);
            break;
            
          case 'previous_messages':
            if (data.messages && Array.isArray(data.messages)) {
              setActiveChat(prevChat => {
                if (!prevChat || prevChat.id !== chatId) return prevChat;
                return {
                  ...prevChat,
                  messages: data.messages
                };
              });
            }
            break;
            
          case 'typing_start':
            // Server signals AI is thinking/processing
            setIsThinking(true);
            setIsStreaming(false);
            break;
            
          case 'typing_end':
            setIsThinking(false);
            break;
            
          case 'message':
            // Handle new complete messages
            if (data.message) {
              const { id, content, role, timestamp, chatId: messageChatId } = data.message;
              
              // For user messages, just add them if they don't exist
              if (role === 'user') {
                setActiveChat(prevChat => {
                  if (!prevChat || prevChat.id !== chatId) return prevChat;
                  
                  // Check if message already exists to prevent duplication
                  const messageExists = prevChat.messages?.some(m => m.id === id);
                  if (messageExists) return prevChat;
                  
                  // When user sends a message, set thinking state to true
                  // until we receive the first chunk or typing_start signal
                  setIsThinking(true);
                  setIsStreaming(false);
                  
                  return {
                    ...prevChat,
                    messages: [...(prevChat.messages || []), {
                      id,
                      chat: messageChatId || chatId,
                      content,
                      sender: Number(user?.id),
                      response: '',
                      timestamp
                    }]
                  };
                });
              } 
              // For assistant messages, create a new placeholder or update existing
              else if (role === 'assistant') {
                // When we receive an empty assistant message, it means response
                // streaming is about to begin
                setIsThinking(false);
                setIsStreaming(true);
                setStreamingMessageId(id);
                
                // If the message is empty, it's just the initial marker
                // and we'll rely on message_update events for content
                if (content === '') {
                  // Just mark that streaming has started, don't add to messages yet
                  console.log('Started streaming response with ID:', id);
                } else {
                  // If it already has content, update the last message
                  setActiveChat(prevChat => {
                    if (!prevChat || prevChat.id !== chatId) return prevChat;
                    
                    const lastMessage = prevChat.messages[prevChat.messages.length - 1];
                    
                    // Update the last message with the AI response
                    if (lastMessage && !lastMessage.response) {
                      return {
                        ...prevChat,
                        messages: prevChat.messages.map((m, index) => 
                          index === prevChat.messages.length - 1 
                            ? { ...m, response: content }
                            : m
                        )
                      };
                    } else {
                      return prevChat;
                    }
                  });
                  
                  // We've received the complete message, streaming is done
                  setIsStreaming(false);
                  setStreamingMessageId(null);
                }
              }
            }
            break;
            
          case 'message_update':
            // Handle streaming updates to assistant responses
            if (data.message_id && data.content) {
              // We're receiving streamed content, update thinking/streaming states
              setIsThinking(false);
              setIsStreaming(true);
              setStreamingMessageId(data.message_id);
              
              setActiveChat(prevChat => {
                if (!prevChat || prevChat.id !== chatId) return prevChat;
                
                // Find the last message and update its response
                const lastMessageIndex = prevChat.messages.length - 1;
                if (lastMessageIndex >= 0) {
                  return {
                    ...prevChat,
                    messages: prevChat.messages.map((m, index) => 
                      index === lastMessageIndex
                        ? { ...m, response: data.content }
                        : m
                    )
                  };
                }
                return prevChat;
              });
              
              // Auto-scroll with each update for a smooth typing effect
              scrollToBottom();
            }
            break;
            
          case 'streaming_complete':
            // Handle the end of streaming
            setIsStreaming(false);
            setStreamingMessageId(null);
            break;
            
          case 'error':
            console.error('WebSocket error message:', data.message);
            setConnectionError(data.message);
            setIsThinking(false);
            setIsStreaming(false);
            break;
            
          default:
            console.log('Unhandled message type:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
      setConnecting(false);
      setIsThinking(false);
      setIsStreaming(false);
      setConnectionError('Connection error occurred');
    };
    
    ws.onclose = (event) => {
      console.log(`WebSocket disconnected with code: ${event.code}`);
      // Only update connection state if this is still the active connection
      if (activeChatIdRef.current === chatId) {
        setConnected(false);
        setConnecting(false);
        setIsThinking(false);
        setIsStreaming(false);
        
        // Handle specific close codes
        if (event.code === 4001) {
          setConnectionError('Authentication failed. Please log in again.');
        } else if (event.code === 4003) {
          setConnectionError('Unauthorized access to this chat.');
        } else if (!event.wasClean) {
          setConnectionError('Connection closed unexpectedly');
        }
      }
    };
    
    wsRef.current = ws;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChat || !connected) return;
    
    const messageContent = message.trim();
    setMessage(''); // Clear input field immediately for better UX
    
    // Send message via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        content: messageContent 
      }));
      
      // Immediately show thinking indicator
      setIsThinking(true);
    } else {
      console.error('WebSocket is not connected');
      setConnectionError('Not connected to server');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Safe way to switch active chat
  const handleChatSelect = useCallback((chat: Chat) => {
    if (chat.id !== activeChat?.id) {
      setActiveChat(chat);
      // Hide any active delete confirmation
      setShowDeleteConfirm(null);
    }
  }, [activeChat?.id]);

  // Get chat title (since your model doesn't have a title field)
  const getChatTitle = (chat: Chat): string => {
    // Try to get the first message content for a better title
    if (chat.messages && chat.messages.length > 0) {
      const firstMessage = chat.messages[0].content;
      if (firstMessage) {
        // Use first ~20 chars of the first message as title
        return firstMessage.length > 20 
          ? `${firstMessage.substring(0, 20)}...` 
          : firstMessage;
      }
    }
    return `Chat ${formatDate(chat.created_at)}`;
  };

  // Create both message bubbles for a single message entry
  const renderMessageWithResponse = (msg: Message) => {
    const timestamp = msg.timestamp || new Date().toISOString();
    
    return (
      <div key={msg.id} className="space-y-4">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            <div className="text-xs mt-2 flex items-center justify-end text-teal-100">
              <Clock size={12} className="mr-1" />
              {formatTime(timestamp)}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-400 text-white flex items-center justify-center flex-shrink-0 ml-3 shadow-md">
            <User size={18} />
          </div>
        </div>
        
        {/* AI response (if exists) */}
        {(msg.response || msg.id === streamingMessageId) && (
          <div className="flex justify-start">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 mr-3 shadow-md">
              <Bot size={18} />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-white border border-slate-100">
              <div className="prose prose-slate prose-sm max-w-none">
                {/* Show cursor animation when streaming this specific message */}
                <ReactMarkdown>{msg.response}</ReactMarkdown>
                {msg.id === streamingMessageId && isStreaming && (
                  <span className="animate-pulse">▋</span>
                )}
              </div>
              <div className="text-xs mt-2 flex items-center justify-end text-slate-400">
                <Clock size={12} className="mr-1" />
                {formatTime(timestamp)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a thinking indicator when waiting for AI response
  const renderThinkingIndicator = () => {
    if (!isThinking) return null;
    
    return (
      <div className="flex justify-start mt-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 mr-3 shadow-md">
          <Bot size={18} />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm max-w-[80%]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Render delete confirmation dialog
  const renderDeleteConfirmation = (chatId: string) => {
    return (
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center space-y-4 border border-red-200 z-10">
        <AlertCircle size={24} className="text-red-500" />
        <p className="text-sm font-medium text-slate-800 text-center">Delete this conversation?</p>
        <p className="text-xs text-slate-500 text-center">This action cannot be undone</p>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowDeleteConfirm(null)} 
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm px-3 py-1 h-8"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => deleteChat(chatId)} 
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 h-8"
            disabled={deletingChat}
          >
            {deletingChat ? (
              <><Loader2 size={14} className="mr-2 animate-spin" /> Deleting...</>
            ) : (
              <>Delete</>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "w-72" : "w-0 sm:w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          {isOpen && (
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              <h2 className="font-bold text-lg">HealthBridge AI</h2>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/10 text-white"
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={createNewChat}
            disabled={isLoading}
            className={cn(
              "w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex items-center justify-center gap-2 shadow-md",
              !isOpen && "p-2"
            )}
          >
            <PlusCircle size={18} />
            {isOpen && <span>New Conversation</span>}
          </Button>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          ) : (
            <ul className="space-y-2 p-3">
              {chats.map(chat => (
                <li key={chat.id} className="relative">
                  <button
                    onClick={() => handleChatSelect(chat)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg flex items-center group",
                      activeChat?.id === chat.id 
                        ? "bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200" 
                        : "hover:bg-slate-100"
                    )}
                  >
                    <MessageSquare 
                      size={16} 
                      className={cn(
                        "flex-shrink-0 mr-3", 
                        activeChat?.id === chat.id 
                          ? "text-teal-600" 
                          : "text-slate-500"
                      )} 
                    />
                    {isOpen && (
                      <>
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium text-sm truncate">
                            {getChatTitle(chat)}
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-1 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatDate(chat.created_at)}
                          </div>
                        </div>
                        
                        {/* Delete button that appears on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(chat.id);
                          }}
                          className={cn(
                            "p-1.5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200",
                            activeChat?.id === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          )}
                          aria-label="Delete conversation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </button>
                  
                  {/* Delete confirmation overlay */}
                  {showDeleteConfirm === chat.id && renderDeleteConfirmation(chat.id)}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* User and Logout */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User size={16} />
                </div>
                <div className="ml-3 truncate">
                  <p className="text-sm font-medium text-slate-800">{user?.username}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-600"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={logout}
              className="w-full flex justify-center p-2 rounded-full hover:bg-slate-200 text-slate-600"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Add Header component here */}
        <Header />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {/* Chat Header with enhanced UI and action buttons */}
          <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mr-3">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  HealthBridge AI Assistant
                </h1>
                <div className="flex items-center text-sm text-slate-500">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    connected ? "bg-green-500" : 
                    connectionError ? "bg-red-500" : "bg-amber-500"
                  )}></div>
                  {connecting ? 'Connecting...' : (connected ? 'Online' : 'Offline')}
                  
                  {connectionError && (
                    <div className="ml-2 px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {connectionError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            {activeChat && (
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowDeleteConfirm(activeChat.id)}
                  className="bg-white hover:bg-red-50 border border-slate-200 text-slate-700 hover:text-red-600 h-9 px-3"
                  title="Delete conversation"
                >
                  <Trash2 size={16} className="mr-1.5" />
                  Delete
                </Button>
                <Button
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 h-9 w-9 p-0"
                  title="Help"
                >
                  <HelpCircle size={16} />
                </Button>
              </div>
            )}
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeChat ? (
              <>
                {/* Welcome message when chat is empty */}
                {activeChat.messages?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full -mt-20">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg">
                      <Sparkles size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to HealthBridge AI</h2>
                    <p className="text-slate-500 text-center max-w-md mb-6">
                      I'm your personal healthcare assistant. Ask me any health-related questions or concerns you might have.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                      {[
                        {
                          title: "Daily Health Tips",
                          description: "How can I improve my overall health?",
                          icon: <Info />
                        },
                        {
                          title: "Symptom Assessment",
                          description: "I've been experiencing [symptom]. What could it be?",
                          icon: <AlertCircle />
                        },
                        {
                          title: "Medication Questions",
                          description: "Can you explain how [medication] works?",
                          icon: <Shield />
                        },
                        {
                          title: "Lifestyle Advice",
                          description: "What diet changes can help with [condition]?",
                          icon: <Settings />
                        }
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage(suggestion.description)}
                          className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all flex items-start space-x-3 text-left"
                        >
                          <div className="text-teal-500 mt-0.5">
                            {suggestion.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800 mb-1">{suggestion.title}</h3>
                            <p className="text-sm text-slate-500">{suggestion.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Messages list */}
                {activeChat.messages?.length > 0 && (
                  <div className="space-y-6">
                    {activeChat.messages.map((msg) => renderMessageWithResponse(msg))}
                    {/* Thinking animation */}
                    {renderThinkingIndicator()}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            ) : (
              // No active chat state
              <div className="flex flex-col items-center justify-center h-full">
                <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">No Conversation Selected</h2>
                <p className="text-slate-500 mb-6">
                  Start a new conversation or select an existing one
                </p>
                <Button
                  onClick={createNewChat}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex items-center justify-center gap-2 shadow-md"
                >
                  <PlusCircle size={18} />
                  <span>New Conversation</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!connected || !activeChat}
                placeholder={connected ? "Type your message..." : "Connecting..."}
                className="flex-1 p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
              />
              <Button
                type="submit"
                disabled={!message.trim() || !connected || !activeChat}
                className={cn(
                  "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-5",
                  (!message.trim() || !connected || !activeChat) && "opacity-70 cursor-not-allowed"
                )}
              >
                {isThinking || isStreaming ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            
            {/* Footer with branding and attribution */}
            <div className="flex items-center justify-center mt-4 text-xs text-slate-400">
              <Shield size={12} className="mr-1.5" />
              HealthBridge AI Assistant &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;