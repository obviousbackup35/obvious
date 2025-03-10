
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const lastDirection = useRef<'up' | 'down' | null>(null);
  const scrollCount = useRef(0);

  // Optimized wheel handler with immediate response
  const throttledWheelHandler = useCallback((e: WheelEvent) => {
    e.preventDefault(); // Prevent default scrolling
    
    const now = Date.now();
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Reset scroll count if direction changed or too much time passed
    if (direction !== lastDirection.current || now - lastScrollTime.current > 100) {
      scrollCount.current = 0;
    }
    
    // Update tracking variables
    lastDirection.current = direction;
    lastScrollTime.current = now;
    scrollCount.current++;

    console.log(`Wheel event - direction: ${direction}, count: ${scrollCount.current}, currentView: from Index.tsx`);

    // Trigger view transition after fewer scroll events in same direction
    if (scrollCount.current >= 1 && !isScrolling.current) {
      isScrolling.current = true;
      
      handleViewTransition(direction);
      
      // Reset scroll state after shorter delay
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = window.setTimeout(() => {
        isScrolling.current = false;
        scrollCount.current = 0;
        scrollTimeout.current = null;
      }, 800); // Longer cooldown to prevent accidental double transitions
    }
  }, [handleViewTransition]);

  useEffect(() => {
    // Clean up function to be called on unmount
    const cleanup = () => {
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
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
