
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
    // Only handle main view transitions, not internal menu navigation
    if (currentView === 'dunes' && isMobile) {
      // Let the PolicyMenu handle its own touch events
      return;
    }
    
    touchStartY.current = e.touches[0].clientY;
  }, [currentView, isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Skip handling in dunes view on mobile (let PolicyMenu handle it)
    if (currentView === 'dunes' && isMobile) {
      return;
    }
    
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
  }, [handleViewTransition, currentView, isMobile]);

  useEffect(() => {
    if (!isPlaying) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e);
    };

    const touchStartHandler = (e: TouchEvent) => {
      handleTouchStart(e);
    };

    const touchMoveHandler = (e: TouchEvent) => {
      handleTouchMove(e);
    };

    // Add wheel event listener for desktop
    window.addEventListener('wheel', wheelHandler, { passive: false });
    
    // Add touch event listeners for mobile
    window.addEventListener('touchstart', touchStartHandler, { passive: true });
    window.addEventListener('touchmove', touchMoveHandler, { passive: true });

    return () => {
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      
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
