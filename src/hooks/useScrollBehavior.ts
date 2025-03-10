import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useAudio } from "@/contexts/AudioContext";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const { isPlaying, hasInitialInteraction } = useAudio();
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const lastDirection = useRef<'up' | 'down' | null>(null);
  const scrollCount = useRef(0);
  const scrollDebounce = useRef<NodeJS.Timeout | null>(null);

  // Wheel event handler with improved detection
  const throttledWheelHandler = useCallback((e: WheelEvent) => {
    // Don't handle scroll events if user hasn't interacted with the site yet
    if (!hasInitialInteraction) {
      console.log("No initial interaction yet, ignoring scroll");
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); // Prevent default scrolling
    
    // Enhanced scroll event processing
    const now = Date.now();
    const direction = e.deltaY > 0 ? 'down' : 'up';
    const significantScroll = Math.abs(e.deltaY) > 1; // Lower threshold to detect scrolls
    
    if (!significantScroll) return;
    
    // Reset scroll count if direction changed or too much time passed
    if (direction !== lastDirection.current || now - lastScrollTime.current > 300) {
      scrollCount.current = 0;
    }
    
    // Update tracking variables
    lastDirection.current = direction;
    lastScrollTime.current = now;
    scrollCount.current++;

    console.log(`Wheel event - direction: ${direction}, count: ${scrollCount.current}, deltaY: ${e.deltaY}`);

    // Clear any existing debounce timeout
    if (scrollDebounce.current) {
      clearTimeout(scrollDebounce.current);
    }

    // Use debounce to ensure more reliable scroll detection
    scrollDebounce.current = setTimeout(() => {
      // Trigger view transition after minimal scroll events for better responsiveness
      if (scrollCount.current >= 1 && !isScrolling.current) {
        isScrolling.current = true;
        
        console.log(`Initiating transition with direction: ${direction}`);
        handleViewTransition(direction);
        
        // Reset scroll state after delay
        if (scrollTimeout.current) {
          window.clearTimeout(scrollTimeout.current);
        }
        
        // Increased timeout to match the view transition duration
        scrollTimeout.current = window.setTimeout(() => {
          isScrolling.current = false;
          scrollCount.current = 0;
          lastDirection.current = null;
          scrollTimeout.current = null;
          console.log('Scroll cooldown complete, ready for next scroll event');
        }, 1500);
      }
    }, 10); // Lower debounce time for better responsiveness
  }, [handleViewTransition, hasInitialInteraction]);

  useEffect(() => {
    // Clean up function to be called on unmount
    const cleanup = () => {
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      if (scrollDebounce.current) {
        clearTimeout(scrollDebounce.current);
      }
      
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', throttledWheelHandler);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
    
    // Reusable preventDefault function
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    if (isMobile) {
      // Mobile-specific setup
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      // Prevent default wheel and touch events
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      // Desktop-specific setup - Using passive: false to allow preventDefault
      window.addEventListener('wheel', throttledWheelHandler, { passive: false });
    }
    
    // Return cleanup function
    return cleanup;
  }, [isMobile, throttledWheelHandler]);
};
