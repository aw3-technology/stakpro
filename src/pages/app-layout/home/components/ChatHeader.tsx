import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onClear: () => void;
}

export const ChatHeader = memo(({ onClear }: ChatHeaderProps) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClear}
            className="h-8 w-8"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear chat history</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
});

ChatHeader.displayName = 'ChatHeader';