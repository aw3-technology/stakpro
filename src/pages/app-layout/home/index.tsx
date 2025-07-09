import { memo } from 'react';
import { EmptyState } from './components/EmptyState';
import { ChatContent } from './components/ChatContent';
import { InputArea } from './components/InputArea';
import { ChatLayout } from './components/ChatLayout';
import { useChatLogic } from './hooks/use-chat-logic';

export const Home = memo(() => {
  const { 
    messages, 
    clearMessages, 
    handleSubmit, 
    containerRef,
    isProcessing 
  } = useChatLogic();

  const hasMessages = messages?.length > 0;

  const chatArea = !hasMessages ? (
    <EmptyState />
  ) : (
    <ChatContent 
      messages={messages} 
      containerRef={containerRef} 
      onClearMessages={clearMessages} 
    />
  );

  const inputArea = (
    <InputArea 
      onSubmit={handleSubmit} 
      showSuggestions={!hasMessages} 
    />
  );

  return (
    <ChatLayout 
      chatArea={chatArea}
      inputArea={inputArea}
    />
  );
});

Home.displayName = 'Home';