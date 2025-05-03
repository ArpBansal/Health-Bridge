//ChatContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Chat, ChatMessage, ChatContextType, WebSocketMessage, WebSocketMessageType } from '../types/type';

// Create the context with default values
const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch chats when component mounts or user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated]);

  // Connect to WebSocket when activeChat changes
  useEffect(() => {
    if (activeChat) {
      connectWebSocket(activeChat.id);
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeChat]);

  const fetchChats = async () => {
    if (!isAuthenticated) return;
    
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

  const createNewChat = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
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
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setConnecting(true);
    
    // Connect to WebSocket with the proper format
    const ws = new WebSocket(`wss://health-bridge-mtzy.onrender.com/ws/chat/${chatId}/?token=${encodeURIComponent(localStorage.getItem('accessToken'))}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setConnecting(false);
    };
    
    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      if (data.type === WebSocketMessageType.MESSAGE && data.message) {
        // Update the active chat with the new message
        setActiveChat(prevChat => {
          if (!prevChat) return null;
          
          return {
            ...prevChat,
            messages: [...prevChat.messages, data.message]
          };
        });
        
        // Also update the chat in our chats list
        setChats(prevChats => prevChats.map(chat => 
          chat.id === chatId ? {
            ...chat,
            messages: [...(chat.messages || []), data.message]
          } : chat
        ));
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
      setConnecting(false);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
    
    wsRef.current = ws;
  };

  const sendMessage = async (content: string) => {
    if (!activeChat || !content.trim()) return;
    
    // Create a new message object
    const newMessage: Partial<ChatMessage> = {
      content: content,
      role: 'user',
      chatId: activeChat.id
    };
    
    try {
      // Send message to API using the new endpoint format
      const response = await fetch(`https://health-bridge-mtzy.onrender.com/ai/chat/${activeChat.id}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ content: content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // The response and AI reply will be handled by the WebSocket
    } catch (error) {
      console.error('Error sending message:', error);
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
      fetchChats,
      createNewChat,
      selectChat,
      sendMessage
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