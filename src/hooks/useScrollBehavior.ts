
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const scrollDirection = useRef<'up' | 'down' | null>(null);

  // Optimized wheel handler with proper throttling and direction tracking
  const throttledWheelHandler = useCallback((e: WheelEvent) => {
    const now = Date.now();
    const deltaY = Math.abs(e.deltaY);
    
    // Ignore small scroll movements
    if (deltaY < 10) return;
    
    // Prevent scroll events that are too close together (200ms throttle)
    if (isScrolling.current || now - lastScrollTime.current < 200) return;
    
    isScrolling.current = true;
    lastScrollTime.current = now;
    
    // Track scroll direction
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Only update direction if it's different from the last one
    if (direction !== scrollDirection.current) {
      scrollDirection.current = direction;
    }
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      handleViewTransition(direction);
      
      // Reset scrolling state after delay
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = window.setTimeout(() => {
        isScrolling.current = false;
        scrollTimeout.current = null;
      }, 250); // Reduced timeout for more responsive feel
    });
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
      // Desktop-specific setup
      window.addEventListener('wheel', throttledWheelHandler, { passive: true });
    }
    
    // Return cleanup function
    return cleanup;
  }, [isMobile, throttledWheelHandler]);
};
