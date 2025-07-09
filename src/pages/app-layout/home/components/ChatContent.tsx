import { memo, RefObject } from 'react';
import { ChatContainer, Message } from '@/components/custom/chat-container';
import { ChatHeader } from './ChatHeader';

interface ChatContentProps {
  messages: Message[];
  containerRef: RefObject<HTMLDivElement>;
  onClearMessages: () => void;
}

export const ChatContent = memo(({ messages, containerRef, onClearMessages }: ChatContentProps) => {
  return (
    <div className="relative">
      <ChatHeader onClear={onClearMessages} />
      <div
        ref={containerRef}
        className="flex justify-center px-4 pt-4"
      >
        <div className="max-w-[752px] w-full">
          <ChatContainer messages={messages} containerRef={containerRef} />
        </div>
      </div>
    </div>
  );
});

ChatContent.displayName = 'ChatContent';