
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const wheelTimeout = useRef<number>();
  const isTransitioning = useRef(false);
  const lastWheelTime = useRef<number>(0);
  const WHEEL_THRESHOLD = 50; // ms between wheel events

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime.current < WHEEL_THRESHOLD || isTransitioning.current) return;
    lastWheelTime.current = now;
    
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

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e);
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelHandler);
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
