import { ReactNode, useEffect } from 'react';
import { ChatContext } from '@/contexts/chat-context';
import { useState } from 'react';
import { Message } from '@/components/custom/chat-container';

const CHAT_STORAGE_KEY = 'stak-chat-history';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from sessionStorage on initial load
    try {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

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
