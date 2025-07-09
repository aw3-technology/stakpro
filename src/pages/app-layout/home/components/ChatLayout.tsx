import { ReactNode } from 'react';

interface ChatLayoutProps {
  chatArea: ReactNode;
  inputArea: ReactNode;
}

export const ChatLayout = ({ chatArea, inputArea }: ChatLayoutProps) => {
  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Banner is rendered at the app level and is fixed */}
      
      {/* Main content area - flex container to fill viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Section 2: Chat area in the middle 
            - pt-[70px] accounts for fixed banner height
            - pb-[220px] accounts for input area height + padding
        */}
        <div className="flex-1 overflow-y-auto pt-[70px] pb-[220px]">
          {chatArea}
        </div>
        
        {/* Section 3: Fixed input area at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {inputArea}
        </div>
      </div>
    </div>
  );
};