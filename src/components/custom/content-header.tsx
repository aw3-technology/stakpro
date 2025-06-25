export const ContentHeader = ({
  title,
  description,
  extra,
}: {
  title: string;
  description: string;
  extra?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between pb-8 gap-4">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-popover-foreground">{title}</h1>
        <p className="text-sm text-foreground/70 font-medium leading-5">
          {description}
        </p>
      </div>
      {extra}
    </div>
  );
};
