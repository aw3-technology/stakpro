import { cn } from '@/lib/utils';
import { BlurFade } from '../magicui/blur-fade';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ExploreCard = ({
  title,
  description,
  subText,
  image,
  iconSymbol,
  className,
  imageSize = 'normal',
  delay = 0,
}: {
  title: string;
  description: string | React.ReactNode;
  subText: string;
  image: string;
  iconSymbol: any;
  className?: string;
  imageSize?: 'normal' | 'large';
  delay?: number;
}) => {
  return (
    <BlurFade delay={delay} inView>  
    <div
      className={cn(
        'rounded-lg min-w-[290px] gap-2 flex items-center flex-row bg-card',
        className
      )}
    >
      <div className="relative top-0 left-0 p-2 flex-shrink-0">
        <div className="relative">
          <img
            src={image}
            alt="Explore Card"
            className={cn(`${imageSize === 'normal' ? 'size-16' : 'size-20'} object-cover rounded-full`)}
          />

          <div
            className={cn(
              'absolute right-0 bottom-0 bg-foreground-light-solid border-2 border-border shadow-shadow-2 shadow-sm rounded-full flex items-center justify-center',
              imageSize === 'normal' ? 'size-6' : 'size-8'
            )}
          >
            <span className="font-normal leading-4 text-foreground/70">
              {iconSymbol}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start py-2 pr-3 w-full">
        <div className="flex flex-col items-start gap-1 w-full">
          <span className="text-base leading-5 text-foreground/70">
            {title}
          </span>
          <span className="text-sm leading-5 text-foreground/50">
            {description}
          </span>
        </div>
        <span className="text-sm text-foreground/50 leading-5">{subText}</span>
      </div>
    </div>
    </BlurFade>
  );
};
