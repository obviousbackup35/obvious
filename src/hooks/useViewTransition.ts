
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const wheelTimeout = useRef<number>();
  const isTransitioning = useRef(false);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchIdentifier = useRef<number | null>(null);
  const WHEEL_THRESHOLD = 50; // ms between wheel events
  const TOUCH_THRESHOLD = 50; // minimum touch move distance to trigger transition
  const isMobile = useIsMobile();
  
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    
    // Set timeout to prevent rapid multiple transitions
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
    
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
  }, [currentView]);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime.current < WHEEL_THRESHOLD || isTransitioning.current) return;
    lastWheelTime.current = now;
    
    if (wheelTimeout.current) {
      window.clearTimeout(wheelTimeout.current);
    }
    
    // Use lightweight debounce for wheel events
    wheelTimeout.current = window.setTimeout(() => {
      const direction = event.deltaY > 0 ? 'down' : 'up';
      handleViewTransition(direction);
    }, 50);
  }, [handleViewTransition]);

  // Optimize touch handling for better mobile performance
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only track the first touch point to avoid multi-touch confusion
    if (e.touches.length === 1 && touchIdentifier.current === null) {
      touchIdentifier.current = e.touches[0].identifier;
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Find our tracked touch point
    if (touchIdentifier.current === null || isTransitioning.current) return;
    
    // Find the touch point we're tracking
    let touchPoint = null;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdentifier.current) {
        touchPoint = e.changedTouches[i];
        break;
      }
    }
    
    if (!touchPoint) return;
    
    const touchY = touchPoint.clientY;
    const diff = touchStartY.current - touchY;
    
    // Only trigger if touch moved enough distance
    if (Math.abs(diff) > TOUCH_THRESHOLD) {
      const direction = diff > 0 ? 'down' : 'up';
      handleViewTransition(direction);
      // Reset touch tracking
      touchStartY.current = 0;
      touchIdentifier.current = null;
    }
  }, [handleViewTransition]);

  const handleTouchEnd = useCallback(() => {
    // Reset touch tracking on end
    touchIdentifier.current = null;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e);
    };
    
    // Add wheel event listener for desktop with passive: false to allow preventDefault
    window.addEventListener('wheel', wheelHandler, { passive: false });
    
    // Add optimized touch event handlers
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      if (wheelTimeout.current) {
        window.clearTimeout(wheelTimeout.current);
      }
    };
  }, [isPlaying, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { 
    currentView, 
    setCurrentView 
  };
};
