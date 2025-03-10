
import { useState, useEffect, useCallback } from 'react';

export const useScrollTransition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // Binary transition - either at video (0) or at dunes (1)
    if (currentScrollY < 50) {
      setScrollProgress(0);
      setIsDarkMode(false);
    } else {
      setScrollProgress(1);
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getTextColor = useCallback(() => {
    // Transition from #c8c5ad (light) to #333333 (dark)
    const lightColor = { r: 200, g: 197, b: 173 }; // #c8c5ad
    const darkColor = { r: 51, g: 51, b: 51 };     // #333333
    
    const r = Math.round(lightColor.r + scrollProgress * (darkColor.r - lightColor.r));
    const g = Math.round(lightColor.g + scrollProgress * (darkColor.g - lightColor.g));
    const b = Math.round(lightColor.b + scrollProgress * (darkColor.b - lightColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [scrollProgress]);

  return { scrollY, scrollProgress, isDarkMode, getTextColor };
};
