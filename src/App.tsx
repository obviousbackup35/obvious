import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Define the Screen Orientation API types
interface ScreenOrientation {
  lock(orientation: OrientationLockType): Promise<void>;
  unlock(): void;
  type: OrientationType;
  angle: number;
  onchange: ((this: ScreenOrientation, ev: Event) => any) | null;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  dispatchEvent(event: Event): boolean;
}

type OrientationLockType = 
  | "any"
  | "natural"
  | "landscape"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

type OrientationType = 
  | "portrait-primary" 
  | "portrait-secondary" 
  | "landscape-primary" 
  | "landscape-secondary";

declare global {
  interface Window {
    screen: Screen & {
      orientation?: ScreenOrientation;
    }
  }
}

const queryClient = new QueryClient();

const App = () => {
  // Try to lock screen orientation to portrait on mobile devices
  useEffect(() => {
    const attemptScreenLock = async () => {
      if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
        try {
          await window.screen.orientation.lock('portrait');
          console.log('Screen locked to portrait');
        } catch (error) {
          console.log('Screen orientation lock failed:', error);
        }
      }
    };
    
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      attemptScreenLock();
    }
  }, []);

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
