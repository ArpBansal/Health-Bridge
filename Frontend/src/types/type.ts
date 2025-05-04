// types.ts - Core type definitions for the chat system

export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
    chatId: string;
    isOptimistic?: boolean;
  }
  
  export interface Chat {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
  }
  
  export enum WebSocketMessageType {
    MESSAGE = 'message',
    TYPING = 'typing',
    SYSTEM = 'system',
    ERROR='error'
  }
  
  export interface WebSocketMessage {
    type: WebSocketMessageType;
    message?: ChatMessage;
    data?: any;
    error?: string;
  }
  
  export interface ChatContextType {
    chats: Chat[];
    activeChat: Chat | null;
    isLoading: boolean;
    connected: boolean;
    connecting: boolean;
    error: string | null;
    fetchChats: () => Promise<void>;
    createNewChat: () => Promise<void>;
    selectChat: (chat: Chat) => void;
    sendMessage: (content: string) => Promise<void>;
    updateChatTitle: (chatId: string, newTitle: string) => void; // Added this line
    deleteChat: (chatId: string) => void; // Added deleteChat method

  }