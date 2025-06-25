import { cn } from "@/lib/utils";

export const InformationHeader = ({
  title,
  secondTitle,
  extra,
  className,
}: {
  title: string | React.ReactNode;
  secondTitle?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 justify-between bg-layout',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {typeof title === 'string' ? (
          <h1 className="text-lg leading-6 text-foreground/70">{title}</h1>
        ) : (
          title
        )}
        {secondTitle}
      </div>
      {extra}
    </div>
  );
};
