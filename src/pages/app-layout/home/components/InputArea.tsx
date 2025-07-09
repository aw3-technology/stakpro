import { memo } from 'react';
import { PromptInputArea } from '@/components/custom/prompt-input-area';

interface InputAreaProps {
  onSubmit: (message: string, files: File[]) => Promise<void>;
  showSuggestions: boolean;
}

export const InputArea = memo(({ onSubmit, showSuggestions }: InputAreaProps) => {
  return (
    <div>
      <div className="flex justify-center px-4 pt-4 pb-8">
        <PromptInputArea
          onSubmit={onSubmit}
          showSuggestions={showSuggestions}
          className="max-w-[752px] w-full"
        />
      </div>
    </div>
  );
});

InputArea.displayName = 'InputArea';