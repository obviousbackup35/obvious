
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

// Define a type that augments the existing ScreenOrientation interface
interface ScreenOrientationExtended {
  lock?(orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'): Promise<void>;
  unlock?(): void;
}

// Augment the existing ScreenOrientation interface instead of redefining it
declare global {
  interface ScreenOrientation extends ScreenOrientationExtended {}
}

export function useForcePortrait() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isMobile) return; // Only apply on mobile devices
    
    // Lock the screen orientation to portrait if supported
    const lockOrientation = async () => {
      try {
        // Check if screen.orientation exists and has a lock method
        if (screen.orientation && 'lock' in screen.orientation && typeof screen.orientation.lock === 'function') {
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
