import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import { Routes } from './routes';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import ScrollToTop from './contexts/ScrollToTop';


const App: React.FC = () => {

  return (
    <StrictMode>
        <BrowserRouter>
          <ThemeProvider>
            <TooltipProvider>
                <ScrollToTop />
                <Routes />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
  );
};

export default App;
