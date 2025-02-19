
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const wheelTimeout = useRef<number>();
  const isTransitioning = useRef(false);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    if (isTransitioning.current) return;
    
    // Debounce da rolagem para evitar múltiplas transições
    if (wheelTimeout.current) {
      window.clearTimeout(wheelTimeout.current);
    }
    
    wheelTimeout.current = window.setTimeout(() => {
      if (event.deltaY > 0 && currentView === 'video') {
        isTransitioning.current = true;
        setCurrentView('dunes');
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000); // Duração da transição
      } else if (event.deltaY < 0 && currentView === 'dunes') {
        isTransitioning.current = true;
        setCurrentView('video');
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000); // Duração da transição
      }
    }, 50); // Debounce delay
  }, [currentView]);

  useEffect(() => {
    if (!isPlaying) return;

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeout.current) {
        window.clearTimeout(wheelTimeout.current);
      }
    };
  }, [isPlaying, handleWheel]);

  return { 
    currentView, 
    setCurrentView 
  };
};
