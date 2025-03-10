import { useState, useEffect, useCallback } from 'react';

export const useScrollTransition = (threshold = 100, maxScroll = 200) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // Transição abrupta: ou mostra o vídeo ou mostra as dunas
    if (currentScrollY < threshold) {
      setScrollProgress(0);
      setIsDarkMode(false);
    } else {
      setScrollProgress(1);
      setIsDarkMode(true);
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getTextColor = useCallback(() => {
    // Transição de #c8c5ad (claro) para #333333 (escuro)
    const lightColor = { r: 200, g: 197, b: 173 }; // #c8c5ad
    const darkColor = { r: 51, g: 51, b: 51 };     // #333333
    
    const r = Math.round(lightColor.r + scrollProgress * (darkColor.r - lightColor.r));
    const g = Math.round(lightColor.g + scrollProgress * (darkColor.g - lightColor.g));
    const b = Math.round(lightColor.b + scrollProgress * (darkColor.b - lightColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [scrollProgress]);

  return { scrollY, scrollProgress, isDarkMode, getTextColor };
};
