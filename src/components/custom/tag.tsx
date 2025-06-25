import { cn } from "@/lib/utils";

export const Tag = ({
  children,
  className,
  small,
}: {
  children: React.ReactNode;
  className?: string;
  small?: boolean;
}) => {
  return (
    <div
      className={cn(
        'bg-foreground/10 text-foreground/60 rounded-md text-sm',
        className,
        small ? 'py-0.5 px-1.5 text-xs rounded-sm' : 'py-1 px-2'
      )}
    >
      {children}
    </div>
  );
};
