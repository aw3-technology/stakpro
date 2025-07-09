import { memo } from 'react';
import { TextAnimate } from "@/components/magicui/text-animate";  
import { BlurFade } from "@/components/magicui/blur-fade";
import { Sparkles } from 'lucide-react';
import PixiProLogo from '/pixipro-logo.svg?inline';

export const EmptyState = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4">
      <BlurFade delay={0.25} inView>
        <img
          src={PixiProLogo}
          alt="Pixi Pro Logo"
          className="w-[104px] mb-8 object-cover antialiased"
        />
      </BlurFade>
      <div className="flex flex-col w-full items-center gap-2 pt-4 pb-7 text-center">
        <TextAnimate 
          animation="blurInUp" 
          delay={0.5} 
          by="character" 
          once 
          as="h1" 
          className='leading-8 font-normal'
        >
          Discover the perfect tools for your project
        </TextAnimate>

        <TextAnimate 
          animation="blurIn" 
          delay={0.8} 
          as="p" 
          className='leading-6'
        >
          AI-powered recommendations to build your perfect development stack 🚀
        </TextAnimate>
        
        <div className="flex items-center gap-2 mt-4 text-sm text-foreground/60">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>Powered by Perplexity AI</span>
        </div>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';