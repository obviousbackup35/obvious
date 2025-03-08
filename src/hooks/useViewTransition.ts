
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const wheelTimeout = useRef<number>();
  const isTransitioning = useRef(false);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const WHEEL_THRESHOLD = 50; // ms between wheel events
  const TOUCH_THRESHOLD = 50; // minimum touch move distance to trigger transition
  const isMobile = useIsMobile();

  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    
    if (direction === 'down') {
      if (currentView === 'video') {
        setCurrentView('black');
      } else if (currentView === 'black') {
        setCurrentView('dunes');
      }
    } else if (direction === 'up') {
      if (currentView === 'dunes') {
        setCurrentView('black');
      } else if (currentView === 'black') {
        setCurrentView('video');
      }
    }
    
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
  }, [currentView]);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime.current < WHEEL_THRESHOLD || isTransitioning.current) return;
    lastWheelTime.current = now;
    
    if (wheelTimeout.current) {
      window.clearTimeout(wheelTimeout.current);
    }
    
    wheelTimeout.current = window.setTimeout(() => {
      const direction = event.deltaY > 0 ? 'down' : 'up';
      handleViewTransition(direction);
    }, 50);
  }, [handleViewTransition]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartY.current || isTransitioning.current) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;
    
    // Only trigger if touch moved enough distance
    if (Math.abs(diff) > TOUCH_THRESHOLD) {
      const direction = diff > 0 ? 'down' : 'up';
      handleViewTransition(direction);
      // Reset touch start to prevent multiple triggers in same movement
      touchStartY.current = 0;
    }
  }, [handleViewTransition]);

  useEffect(() => {
    if (!isPlaying) return;

    // Passive: false for wheel to enable preventDefault
    // Passive: true for touch events as we're not preventing default there
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      
      if (wheelTimeout.current) {
        window.clearTimeout(wheelTimeout.current);
      }
    };
  }, [isPlaying, handleWheel, handleTouchStart, handleTouchMove]);

  return { 
    currentView, 
    setCurrentView 
  };
};
