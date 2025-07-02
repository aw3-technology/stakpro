import {
  ArrowUp,
  Code,
  Database,
  LightbulbIcon,
  Loader,
  Plus,
  SparklesIcon,
  Settings,
  Smartphone,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { ShineBorder } from "@/components/magicui/shine-border";

interface PromptInputAreaProps {
  showSuggestions?: boolean;
  onSubmit: (message: string, files: File[]) => Promise<void>;
  className?: string;
}

export const PromptInputArea = ({
  showSuggestions = true,
  className,
  onSubmit,
}: PromptInputAreaProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("Find the best tools for a React TypeScript project with Node.js backend. Include code editor, database, testing framework, and deployment tools. Budget-friendly options preferred.");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const suggestionPrompts = [
    {
      icon: <Code className="text-green-600 size-4" />,
      value: 'Frontend stack',
    },
    {
      icon: <LightbulbIcon className="text-cyan-600 size-4" />,
      value: 'Get inspired',
    },
    {
      icon: <SparklesIcon className="text-indigo-600 size-4" />,
      value: 'Discover new tools',
    },
    {
      icon: <Database className="text-yellow-600 size-4" />,
      value: 'Backend tools',
    },
    {
      icon: <Smartphone className="text-pink-600 size-4" />,
      value: 'Mobile dev',
    },
    {
      icon: <Settings className="text-pink-500 size-4" />,
      value: 'DevOps',
    },
  ];

  const handleSubmit = async () => {
    if (input.trim() || files.length > 0) {
      setIsLoading(true);
      await onSubmit(input.trim(), files);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setInput('');
      setFiles([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="w-full rounded-xl bg-card relative overflow-hidden">
        <div className="relative rounded-xl">
          <ShineBorder duration={4} style={{opacity: 0.8}} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            style={{
              backgroundColor: 'transparent',
            }}
            className="flex field-sizing-content max-h-[80px] md:max-h-[200px] w-full rounded-xl px-4 py-3 leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none] shadow-none border-none focus-visible:ring-0"
            placeholder="Ask me anything about your project tools.."
            aria-label="Enter your prompt"
          />
          <div className="flex items-center justify-between gap-2 py-2 px-3 bg-transparent transition-colors">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor="file-upload"
                    className="hover:bg-card-foreground/10 border border-input flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Plus className="size-3" />
                  </label>
                </TooltipTrigger>
                <TooltipContent showArrow>
                  <p className="text-xs">Attach files</p>
                </TooltipContent>
              </Tooltip>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                          <span className="max-w-[120px] truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="hover:bg-secondary/50 rounded-full p-1"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent showArrow>
                        <p className="text-xs">{file.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
            <Button
              size="icon"
              className="rounded-full size-8 cursor-pointer"
              onClick={handleSubmit}
              type="submit"
            >
              {isLoading ? (
                <Loader className="w-[7px] h-[7px] animate-[spin_4s_linear_infinite]" />
              ) : (
                <ArrowUp className="w-[7px] h-[7px]" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {suggestionPrompts.map((prompt) => (
            <Button
              variant="outline"
              className="border-2 border-input gap-2 px-5 font-normal cursor-pointer text-neutral-500"
              key={prompt.value}
              onClick={() => setInput(prompt.value)}
            >
              <div className="hidden md:block">{prompt.icon}</div>
              {prompt.value}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
