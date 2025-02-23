
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const wheelTimeout = useRef<number>();
  const isTransitioning = useRef(false);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    if (isTransitioning.current) return;
    
    if (wheelTimeout.current) {
      window.clearTimeout(wheelTimeout.current);
    }
    
    wheelTimeout.current = window.setTimeout(() => {
      if (event.deltaY > 0) {
        isTransitioning.current = true;
        if (currentView === 'video') {
          setCurrentView('black');
        } else if (currentView === 'black') {
          setCurrentView('dunes');
        }
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000);
      } else if (event.deltaY < 0) {
        isTransitioning.current = true;
        if (currentView === 'dunes') {
          setCurrentView('black');
        } else if (currentView === 'black') {
          setCurrentView('video');
        }
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000);
      }
    }, 50);
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
