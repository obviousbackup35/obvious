
import { useState, useEffect, useCallback } from 'react';

export const useScrollTransition = (threshold = 200, maxScroll = 400) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // Calculate progress (0 to 1) based on scroll position
    if (currentScrollY <= threshold) {
      setScrollProgress(0);
      setIsDarkMode(false);
    } else if (currentScrollY >= maxScroll) {
      setScrollProgress(1);
      setIsDarkMode(true);
    } else {
      const progress = (currentScrollY - threshold) / (maxScroll - threshold);
      setScrollProgress(progress);
      setIsDarkMode(progress > 0.5);
    }
  }, [threshold, maxScroll]);

  useEffect(() => {
    // Enable scrolling on the body
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.touchAction = 'auto';
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset body style when component unmounts
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.touchAction = 'none';
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
