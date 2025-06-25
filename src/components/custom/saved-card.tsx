import { BlurFade } from "../magicui/blur-fade";

export const SavedCard = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  return (
    <BlurFade delay={delay} inView>    
    <div className="relative bg-card rounded-lg pb-4 flex flex-col min-w-[290px] min-h-[390px] gap-3 items-center backdrop-blur-lg shadow-shadow-2">
      {children}
    </div>
    </BlurFade>
  );
};
