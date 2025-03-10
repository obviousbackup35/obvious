
import { useState, useCallback } from 'react';

export const useScrollTransition = () => {
  const [isDunesVisible, setIsDunesVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Toggle between video and dunes
  const toggleDunes = useCallback(() => {
    setIsDunesVisible(prev => !prev);
    setIsDarkMode(prev => !prev);
    setScrollProgress(prev => prev === 0 ? 1 : 0);
  }, []);

  const getTextColor = useCallback(() => {
    // Transition from #c8c5ad (light) to #333333 (dark)
    const lightColor = { r: 200, g: 197, b: 173 }; // #c8c5ad
    const darkColor = { r: 51, g: 51, b: 51 };     // #333333
    
    const r = Math.round(lightColor.r + scrollProgress * (darkColor.r - lightColor.r));
    const g = Math.round(lightColor.g + scrollProgress * (darkColor.g - lightColor.g));
    const b = Math.round(lightColor.b + scrollProgress * (darkColor.b - lightColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [scrollProgress]);

  return { 
    scrollProgress, 
    isDarkMode, 
    getTextColor,
    isDunesVisible,
    toggleDunes
  };
};
