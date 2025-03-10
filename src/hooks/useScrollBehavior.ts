
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useAudio } from "@/contexts/AudioContext";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const { hasInitialInteraction } = useAudio();
  const debounceTimeout = useRef<number | null>(null);
  
  // Simplified scroll handler
  const handleWheel = useCallback((e: WheelEvent) => {
    // Check for initial interaction
    if (!hasInitialInteraction) {
      console.log("No initial interaction yet, ignoring scroll");
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); // Prevent default scrolling
    
    // Use a simple debounce to avoid multiple events
    if (debounceTimeout.current) {
      return;
    }
    
    // Determine scroll direction
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Log event for debugging
    console.log(`Wheel event detected - direction: ${direction}, deltaY: ${e.deltaY}`);
    
    // Trigger view transition immediately
    handleViewTransition(direction);
    
    // Set debounce to prevent rapid succession events
    debounceTimeout.current = window.setTimeout(() => {
      debounceTimeout.current = null;
      console.log('Scroll debounce complete, ready for next scroll event');
    }, 500);
  }, [handleViewTransition, hasInitialInteraction]);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (debounceTimeout.current) {
        window.clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
      
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
    
    // Simple function to prevent default events
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    if (isMobile) {
      // Mobile setup
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      // Desktop setup
      window.addEventListener('wheel', handleWheel, { passive: false });
      console.log('Desktop wheel handler registered');
    }
    
    return cleanup;
  }, [isMobile, handleWheel]);
};
