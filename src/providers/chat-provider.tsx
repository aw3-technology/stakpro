import { ReactNode, useEffect } from 'react';
import { ChatContext } from '@/contexts/chat-context';
import { useState } from 'react';
import { Message } from '@/components/custom/chat-container';

const CHAT_STORAGE_KEY = 'stak-chat-history';

export function ChatProvider({ children }: { children: ReactNode }) {
  // Temporarily disable sessionStorage to avoid JSX serialization issues
  const [messages, setMessages] = useState<Message[]>([]);

  // Clear any corrupted data from sessionStorage
  useEffect(() => {
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, setMessages, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
