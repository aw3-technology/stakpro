import { createContext } from 'react';
import { Message } from '@/components/custom/chat-container';

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);


