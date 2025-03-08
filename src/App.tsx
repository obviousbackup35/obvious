
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { AuthProvider } from "./components/AuthProvider";
import { useIsMobile } from "./hooks/use-mobile";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();
  
  // Lock screen orientation on mobile
  useEffect(() => {
    if (isMobile && window.screen && window.screen.orientation) {
      try {
        // Try to lock the screen orientation to portrait if the API is available
        window.screen.orientation.lock('portrait').catch(() => {
          console.log('Orientation lock not supported or permission denied');
        });
      } catch (e) {
        console.log('Orientation API not supported');
      }
    }
  }, [isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AudioProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AudioProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
