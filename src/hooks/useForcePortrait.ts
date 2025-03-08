
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

// Declare a interface para a API Screen Orientation
interface ScreenOrientationAPI {
  lock(orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'): Promise<void>;
  unlock(): void;
  type: string;
  angle: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  dispatchEvent(event: Event): boolean;
}

// Estender a interface Screen global
declare global {
  interface Screen {
    orientation?: ScreenOrientationAPI;
  }
}

export function useForcePortrait() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isMobile) return; // Only apply on mobile devices
    
    // Lock the screen orientation to portrait if supported
    const lockOrientation = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          await screen.orientation.lock('portrait');
          console.log('Screen orientation locked to portrait');
        }
      } catch (error) {
        console.log('Failed to lock orientation:', error);
        // Fallback handled by CSS
      }
    };
    
    // Handle orientation change events
    const handleOrientationChange = () => {
      // Additional handling if needed
      if (window.innerHeight < window.innerWidth) {
        console.log('Device in landscape mode - CSS will handle rotation');
      }
    };
    
    // Initial lock attempt
    lockOrientation();
    
    // Set up event listener
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);
}
