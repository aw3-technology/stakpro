import { AppLayoutContentHeader } from "./app-layout-content-header";

export const AppLayoutContent = ({title, description, children}: {title?: React.ReactNode, description?: React.ReactNode, children: React.ReactNode}) => {
  return (
    <div className="flex flex-col max-w-[752px] mx-auto w-full h-full gap-8 px-4 pb-28 lg:pb-14 pt-14 lg:pt-16">
      {title && <AppLayoutContentHeader title={title} description={description} />}
      {children}
    </div>
  );
};