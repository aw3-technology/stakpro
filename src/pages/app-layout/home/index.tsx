/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { PromptInputArea } from '@/components/custom/prompt-input-area';
import PixiProLogo from '/pixipro-logo.svg?inline';
import { useChat } from '@/hooks/use-chat';
import {
  ChatContainer,
  Message as MessageType,
} from '@/components/custom/chat-container';
import { useAIAssistant } from './hooks/use-ai-assistant';
import { TextAnimate } from "@/components/magicui/text-animate";  
import { BlurFade } from "@/components/magicui/blur-fade";
import { Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Home = () => {
  const { messages, addMessage, setMessages, clearMessages } = useChat();
  const { processUserMessage } = useAIAssistant();

  useEffect(() => {
    // Handle AI follow-up questions
    const handleFollowUp = (event: CustomEvent) => {
      if (event.detail?.message) {
        handleSubmit(event.detail.message, []);
      }
    };

    window.addEventListener('ai-followup', handleFollowUp as EventListener);

    return () => {
      window.removeEventListener('ai-followup', handleFollowUp as EventListener);
    };
  }, []);

  const handleSubmit = async (message: string, files: File[]) => {
    if (message.trim() || files.length > 0) {
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
        aiResponses.forEach((response, index) => {
          setTimeout(() => {
            addMessage(response);
          }, 500 * (index + 1)); // Stagger responses for better UX
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col w-full min-h-svh items-center gap-7 justify-center pb-24 lg:pb-4">
      {messages?.length <= 0 && (
        <>
          <BlurFade delay={0.25} inView>
            <img
              src={PixiProLogo}
              alt="Pixi Pro Logo"
              className="w-[104px] -mb-6 object-cover antialiased"
            />
          </BlurFade>
          <div className="flex flex-col w-full items-center gap-2 pt-4 pb-7 text-center">
            <TextAnimate animation="blurInUp" delay={0.5} by="character" once as="h1" className='leading-8 font-normal'>
              Discover the perfect tools for your project
            </TextAnimate>

            <TextAnimate animation="blurIn" delay={0.8} as="p" className='leading-6'>
              AI-powered recommendations to build your perfect development stack 🚀
            </TextAnimate>
            
            <div className="flex items-center gap-2 mt-4 text-sm text-foreground/60">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Powered by Perplexity AI</span>
            </div>
          </div>
        </>
      )}

      {messages?.length > 0 && (
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-auto flex justify-center relative"
        >
          <div className="max-w-[752px] w-full px-4">
            <ChatContainer messages={messages} containerRef={containerRef} />
          </div>
          <div className="absolute top-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearMessages}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear chat history</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      <PromptInputArea
        onSubmit={handleSubmit}
        showSuggestions={messages?.length <= 0}
        className="max-w-[752px] w-full px-2"
      />
    </div>
  );
};