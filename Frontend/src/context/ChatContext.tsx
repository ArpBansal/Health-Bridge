//ChatContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Chat, ChatMessage, ChatContextType, WebSocketMessage, WebSocketMessageType } from '../types/type';

// Create the context with default values
const ChatContext = createContext<ChatContextType | null>(null);

// Maximum reconnection attempts
const MAX_RECONNECT_ATTEMPTS = 5;
// Base delay for exponential backoff (in ms)
const RECONNECT_BASE_DELAY = 1000;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeChatIdRef = useRef<string | null>(null);

  // Fetch chats when component mounts or user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    } else {
      // Clear chats when user logs out
      setChats([]);
      setActiveChat(null);
    }
  }, [isAuthenticated]);

  // Keep track of active chat ID for reconnection purposes
  useEffect(() => {
    if (activeChat) {
      activeChatIdRef.current = activeChat.id;
      connectWebSocket(activeChat.id);
    } else {
      activeChatIdRef.current = null;
    }
    
    // Cleanup function
    return () => {
      cleanupWebSocket();
    };
  }, [activeChat]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);

  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setConnected(false);
    setConnecting(false);
  }, []);

  const fetchChats = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://health-bridge-mtzy.onrender.com/ai/chats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.status}`);
      }
      
      const data = await response.json();
      setChats(data);
      
      // If we have chats and no active chat, set the first one as active
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch chats');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://health-bridge-mtzy.onrender.com/ai/chats/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          title: 'New Conversation'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.status}`);
      }
      
      const newChat = await response.json();
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = useCallback((chatId: string) => {
    // Clean up any existing connection first
    cleanupWebSocket();
    
    setConnecting(true);
    setError(null);
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authentication token not found');
      setConnecting(false);
      return;
    }

    try {
      // Connect to WebSocket with the proper format
      const ws = new WebSocket(`wss://health-bridge-mtzy.onrender.com/ws/chat/${chatId}/?token=${encodeURIComponent(token)}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setConnecting(false);
        reconnectAttemptsRef.current = 0; // Reset reconnection attempts on successful connection
      };
      
      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.type === WebSocketMessageType.MESSAGE && data.message) {
            // Update the active chat with the new message
            setActiveChat(prevChat => {
              if (!prevChat || prevChat.id !== chatId) return prevChat;
              
              // Create a new messages array to avoid mutation
              const updatedMessages = [...(prevChat.messages || [])];
              
              // Check if this message is already in the chat (by id or content+timestamp)
              const messageExists = data.message.id && 
                updatedMessages.some(msg => msg.id === data.message.id);
              
              if (!messageExists) {
                updatedMessages.push(data.message);
              }
              
              return {
                ...prevChat,
                messages: updatedMessages
              };
            });
            
            // Also update the chat in our chats list
            setChats(prevChats => prevChats.map(chat => {
              if (chat.id !== chatId) return chat;
              
              // Create a new messages array to avoid mutation
              const updatedMessages = [...(chat.messages || [])];
              
              // Check if this message is already in the chat
              const messageExists = data.message.id && 
                updatedMessages.some(msg => msg.id === data.message.id);
              
              if (!messageExists) {
                updatedMessages.push(data.message);
              }
              
              return {
                ...chat,
                messages: updatedMessages,
                // Update the title if this is the first user message and chat has default title
                title: chat.title === 'New Conversation' && 
                      updatedMessages.length === 1 && 
                      data.message.role === 'user' 
                      ? data.message.content.substring(0, 30) + (data.message.content.length > 30 ? '...' : '') 
                      : chat.title
              };
            }));
          } else if (data.type === WebSocketMessageType.ERROR) {
            console.error('WebSocket error message:', data.error);
            setError(data.error || 'Unknown WebSocket error');
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
        setConnecting(false);
        setError('WebSocket connection error');
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setConnected(false);
        setConnecting(false);
        
        // Don't attempt to reconnect if the closing was intentional or the component is unmounting
        const shouldReconnect = 
          activeChatIdRef.current === chatId && 
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS &&
          event.code !== 1000; // Normal closure
        
        if (shouldReconnect) {
          // Exponential backoff for reconnection
          const delay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`Attempting to reconnect in ${delay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (activeChatIdRef.current === chatId) {
              reconnectAttemptsRef.current++;
              connectWebSocket(chatId);
            }
          }, delay);
        }
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setConnected(false);
      setConnecting(false);
      setError('Failed to establish WebSocket connection');
    }
  }, [cleanupWebSocket]);

  const sendMessage = async (content: string) => {
    if (!activeChat || !content.trim() || !connected) {
      if (!connected) {
        setError('Cannot send message: WebSocket not connected');
      }
      return;
    }
    
    setError(null);
    
    // Optimistically add the user message to the UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: content,
      role: 'user',
      chatId: activeChat.id,
      timestamp: new Date().toISOString(),
      isOptimistic: true // Flag to identify this as an optimistic update
    };
    
    // Update active chat with optimistic message
    setActiveChat(prevChat => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        messages: [...prevChat.messages, tempMessage]
      };
    });
    
    // Update chats list with optimistic message
    setChats(prevChats => prevChats.map(chat => 
      chat.id === activeChat.id ? {
        ...chat,
        messages: [...(chat.messages || []), tempMessage],
        // Update title for the first message if it's still the default
        title: chat.title === 'New Conversation' && chat.messages.length === 0 
          ? content.substring(0, 30) + (content.length > 30 ? '...' : '') 
          : chat.title
      } : chat
    ));
    
    try {
      // Send message to API
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${activeChat.id}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ content: content })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      // The real message (and AI reply) will be handled by the WebSocket
      // The server should respond with the actual message id which will replace our temp message
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove the optimistic message on failure
      setActiveChat(prevChat => {
        if (!prevChat) return null;
        return {
          ...prevChat,
          messages: prevChat.messages.filter(msg => msg.id !== tempMessage.id)
        };
      });
      
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat.id ? {
          ...chat,
          messages: (chat.messages || []).filter(msg => msg.id !== tempMessage.id)
        } : chat
      ));
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    if (!isAuthenticated || !newTitle.trim()) return;
    
    try {
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${chatId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update chat title: ${response.status}`);
      }
      
      const updatedChat = await response.json();
      
      // Update the chat in our state
      setChats(prevChats => prevChats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
      
      // Also update active chat if needed
      setActiveChat(prevChat => 
        prevChat && prevChat.id === chatId ? { ...prevChat, title: newTitle } : prevChat
      );
    } catch (error) {
      console.error('Error updating chat title:', error);
      setError(error instanceof Error ? error.message : 'Failed to update chat title');
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${chatId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }
      
      // Remove the chat from our state
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      
      // If we deleted the active chat, select another one
      if (activeChat && activeChat.id === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete chat');
    }
  };

  const selectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      isLoading,
      connected,
      connecting,
      error,
      fetchChats,
      createNewChat,
      selectChat,
      sendMessage,
      updateChatTitle,
      deleteChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};