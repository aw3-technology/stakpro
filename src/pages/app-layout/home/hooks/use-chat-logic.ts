import { useCallback, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/use-chat';
import { useAIAssistant } from './use-ai-assistant-v2';
import { Message as MessageType } from '@/components/custom/chat-container';

export const useChatLogic = () => {
  const { messages, addMessage, setMessages, clearMessages } = useChat();
  const { processUserMessage, isProcessing } = useAIAssistant();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle AI follow-up questions
  useEffect(() => {
    const handleFollowUp = (event: CustomEvent) => {
      if (event.detail?.message) {
        handleSubmit(event.detail.message, []);
      }
    };

    window.addEventListener('ai-followup', handleFollowUp as EventListener);

    return () => {
      window.removeEventListener('ai-followup', handleFollowUp as EventListener);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async (message: string, files: File[]) => {
    if (!message.trim() && files.length === 0) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      files: files,
    };
    addMessage(userMessage);

    // Process with AI assistant
    try {
      const aiResponses = await processUserMessage(message.trim(), setMessages);
      
      // Add the first response immediately (which includes the loading state)
      if (aiResponses.length > 0) {
        addMessage(aiResponses[0]);
      }
      
      // If there are additional responses, add them with a delay
      aiResponses.slice(1).forEach((response, index) => {
        setTimeout(() => {
          addMessage(response);
        }, 500 * (index + 1));
      });
    } catch (error) {
      console.error('Error processing message:', error);
      // Add error message
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
      });
    }
  }, [addMessage, processUserMessage, setMessages]);

  return {
    messages,
    clearMessages,
    handleSubmit,
    containerRef,
    isProcessing,
  };
};