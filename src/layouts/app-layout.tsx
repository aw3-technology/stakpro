import React from 'react';
import { Navbar } from '../components/custom/navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="h-svh w-full flex flex-col">
      <main className="flex-1 overflow-hidden">{children}</main>
      <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center lg:w-auto lg:h-full lg:left-4 lg:right-auto lg:justify-start z-50">
        <Navbar />
      </div>
    </div>
  );
};
