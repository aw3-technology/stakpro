import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import { Routes } from './routes';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './contexts/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { CommandPalette } from './components/custom/command-palette';


const App: React.FC = () => {

  return (
    <StrictMode>
        <BrowserRouter>
          <ThemeProvider>
            <TooltipProvider>
              <AuthProvider>
                <ScrollToTop />
                <Routes />
                <CommandPalette />
                <Toaster />
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
  );
};

export default App;
