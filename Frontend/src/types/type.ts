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
    SYSTEM = 'system'
  }
  
  export interface WebSocketMessage {
    type: WebSocketMessageType;
    message?: ChatMessage;
    data?: any;
  }
  
  export interface ChatContextType {
    chats: Chat[];
    activeChat: Chat | null;
    isLoading: boolean;
    connected: boolean;
    connecting: boolean;
    fetchChats: () => Promise<void>;
    createNewChat: () => Promise<void>;
    selectChat: (chat: Chat) => void;
    sendMessage: (content: string) => Promise<void>;
  }