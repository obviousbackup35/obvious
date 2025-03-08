
import { useEffect } from "react";

export const useScrollBehavior = () => {
  useEffect(() => {
    // Add no-bounce classes to prevent overscroll
    document.documentElement.classList.add('no-bounce');
    document.body.classList.add('no-bounce');
    
    // Prevent default wheel and touch events to disable scrolling navigation
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    // Add event listeners to prevent scrolling
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
  }, []);
};
