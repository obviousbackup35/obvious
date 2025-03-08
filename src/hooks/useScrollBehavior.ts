
import { useEffect } from "react";
import { useIsMobile } from "./use-mobile";
import { useViewTransition } from "./useViewTransition";

export const useScrollBehavior = () => {
  const isMobile = useIsMobile();
  const { handleViewTransition } = useViewTransition(false);

  useEffect(() => {
    // Only prevent scrolling on mobile devices
    if (isMobile) {
      // Add no-bounce classes to prevent overscroll
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      // Prevent default wheel and touch events to disable scrolling navigation on mobile
      const preventDefault = (e: Event) => {
        e.preventDefault();
      };
      
      // Add event listeners to prevent scrolling on mobile
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        // Clean up when component unmounts
        document.documentElement.classList.remove('no-bounce');
        document.body.classList.remove('no-bounce');
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
      };
    } else {
      // On desktop, we'll handle the wheel event for navigation
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY > 0) {
          // Scrolling down
          handleViewTransition('down');
        } else if (e.deltaY < 0) {
          // Scrolling up
          handleViewTransition('up');
        }
      };
      
      // Use a more optimized approach with requestAnimationFrame for better performance
      let wheelTimeout: number | null = null;
      const throttledWheelHandler = (e: WheelEvent) => {
        if (wheelTimeout === null) {
          wheelTimeout = window.setTimeout(() => {
            handleWheel(e);
            wheelTimeout = null;
          }, 800); // Throttle wheel events
        }
      };
      
      window.addEventListener('wheel', throttledWheelHandler);
      
      return () => {
        window.removeEventListener('wheel', throttledWheelHandler);
        if (wheelTimeout !== null) {
          window.clearTimeout(wheelTimeout);
        }
      };
    }
  }, [isMobile, handleViewTransition]);
};
