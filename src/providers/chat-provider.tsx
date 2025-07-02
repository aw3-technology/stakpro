import { ReactNode } from 'react';
import { ChatContext } from '@/contexts/chat-context';
import { useState } from 'react';
import { Message } from '@/components/custom/chat-container';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, setMessages, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
