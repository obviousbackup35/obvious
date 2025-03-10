
import { useState, useEffect, useCallback } from 'react';

export const useScrollTransition = (threshold = 200, maxScroll = 300) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // Simplificando a transição para ser mais abrupta
    if (currentScrollY <= threshold) {
      // Quando está no topo, mostra o vídeo (0% das dunas)
      setScrollProgress(0);
      setIsDarkMode(false);
    } else if (currentScrollY >= maxScroll) {
      // Quando rola para baixo além do limite, mostra as dunas (100%)
      setScrollProgress(1);
      setIsDarkMode(true);
    } else {
      // Durante a transição, tornando-a mais rápida
      const progress = Math.pow((currentScrollY - threshold) / (maxScroll - threshold), 2);
      setScrollProgress(progress);
      setIsDarkMode(progress > 0.5);
    }
  }, [threshold, maxScroll]);

  useEffect(() => {
    // Explicitamente habilitar scrolling
    document.body.style.overflow = 'visible';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    document.body.style.touchAction = 'auto';
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Chamar handleScroll imediatamente para definir valores iniciais
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
