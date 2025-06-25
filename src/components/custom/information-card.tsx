export const InformationCard = ({
  title,
  secondTitle,
  children,
  extra,
}: {
  title: string;
  secondTitle: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full bg-layout">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg leading-6 text-foreground/70">{title}</h1>
          {secondTitle}
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
};
