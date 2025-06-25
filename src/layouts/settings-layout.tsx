import { AppSidebar } from '@/components/custom/app-sidebar';
import { BackToApp } from '@/components/custom/back-to-app';
import React from 'react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-row bg-settings-background">
      <AppSidebar />
      <div className="fixed top-0 w-full z-50">
        <BackToApp />
      </div>
      <main className="flex flex-col max-w-[752px] mx-auto w-full  px-4 py-14 lg:py-16">
        {children}
      </main>
    </div>
  );
};
