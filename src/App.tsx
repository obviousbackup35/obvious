
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
  
  // Configure scrolling for the entire page
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = '100vh';
    document.body.style.overflow = 'auto';
    document.body.style.height = '100vh';
    document.body.style.position = 'static';
    
    // Set up scroll snap points
    document.documentElement.style.scrollSnapType = 'y mandatory';
    document.body.style.scrollSnapType = 'y mandatory';
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AudioProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AudioProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
