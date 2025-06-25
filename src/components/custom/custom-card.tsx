import { cn } from '@/lib/utils';

export const CustomCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col p-4 gap-4 rounded-2xl bg-card border-card-solid border-1 w-full',
        className
      )}
    >
      {children}
    </div>
  );
};
