export const AppLayoutContentHeader = ({title, description}: {title: React.ReactNode, description: React.ReactNode}) => {
  return (
    <div className="flex flex-col gap-2">
      {title}
      {description}
    </div>
  );
};
