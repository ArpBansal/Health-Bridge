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
  ArrowRight
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
      const response = await fetch('http://127.0.0.1:8000/ai/chats/', {
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
      const response = await fetch(`http://127.0.0.1:8000/ai/chat/${chatId}/messages/`, {
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

  const createNewChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/ai/chats/', {
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
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/?token=${encodeURIComponent(token || '')}`);
    
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
    }
  }, [activeChat?.id]);

  // Get chat title (since your model doesn't have a title field)
  const getChatTitle = (chat: Chat): string => {
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
                <li key={chat.id}>
                  <button
                    onClick={() => handleChatSelect(chat)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg flex items-center",
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
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium text-sm truncate">
                          {getChatTitle(chat)}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(chat.created_at)}
                        </div>
                      </div>
                    )}
                  </button>
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
        {/* Chat Header - Removed duplicate menu button */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center shadow-sm">
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
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
          {activeChat ? (
            activeChat.messages && activeChat.messages.length > 0 ? (
              <>
                {activeChat.messages.map(renderMessageWithResponse)}
                
                {/* Thinking indicator - shown when isThinking is true */}
                {renderThinkingIndicator()}
                
                {/* Show thinking indicator for the latest message if no response yet */}
                {activeChat.messages.length > 0 && 
                 !activeChat.messages[activeChat.messages.length - 1].response &&
                 !isThinking && (
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
                )}
              </>
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-3">Welcome to HealthBridge AI</h3>
                <p className="text-slate-500 max-w-md mb-6">
                  Your personal healthcare assistant. Ask anything about healthcare, your medical conditions, or get general health advice.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
                  <Button 
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm px-4 py-3 h-auto flex items-center justify-center"
                    onClick={() => {
                      setMessage("What can you help me with?");
                      setTimeout(() => {
                        handleSendMessage(new Event('submit') as any);
                      }, 100);
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">What can you help me with?</span>
                      <span className="text-xs text-slate-500">Get started with basic info</span>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm px-4 py-3 h-auto flex items-center justify-center"
                    onClick={() => {
                      setMessage("Tell me about healthy eating habits");
                      setTimeout(() => {
                        handleSendMessage(new Event('submit') as any);
                      }, 100);
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Healthy eating habits</span>
                      <span className="text-xs text-slate-500">Get nutrition advice</span>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">No active conversation</h3>
              <p className="text-slate-500 mt-2 max-w-md mb-6">
                Create a new conversation or select an existing one to start chatting with HealthBridge AI.
              </p>
              <Button
                onClick={createNewChat}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 shadow-md"
              >
                <PlusCircle size={18} className="mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {activeChat && (
          <div className="bg-white border-t border-slate-200 p-4 px-6">
            <form onSubmit={handleSendMessage} className="flex space-x-3 max-w-4xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-slate-300 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                disabled={!connected || isThinking}
              />
              <Button 
                type="submit" 
                disabled={!connected || !message.trim() || isThinking}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-6 shadow-md"
              >
                <Send size={18} />
              </Button>
            </form>
            <div className="text-center mt-2 text-xs text-slate-400">
              HealthBridge AI is designed to provide general information, not medical advice. Always consult with healthcare professionals.
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ChatInterface;