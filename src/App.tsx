
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { useForcePortrait } from "./hooks/useForcePortrait";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Force portrait mode on mobile devices
  useForcePortrait();
  
  // Configure scrolling behavior - no scrollbars, no scroll
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: hidden;
        height: 100%;
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none;
      }
      #app-wrapper {
        height: 100vh;
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AudioProvider>
            <Toaster />
            <Sonner />
            <div id="app-wrapper">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AudioProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
