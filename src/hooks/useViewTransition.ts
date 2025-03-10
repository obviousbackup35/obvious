
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isTransitioning = useRef(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // Debug current view changes
  useEffect(() => {
    console.log(`View transition - Current view is now: ${currentView}`);
  }, [currentView]);

  // Clear any existing transition timeouts
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    // Importante: Verificar se já não estamos em transição para evitar problemas
    if (isTransitioning.current) {
      console.log('Transition already in progress, ignoring scroll');
      return;
    }
    
    isTransitioning.current = true;
    console.log(`View transition - Direction: ${direction}, Current view: ${currentView}`);
    
    // Clear any existing transition timeout
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    // Process the transition based on current view and direction
    if (direction === 'down') {
      if (currentView === 'video') {
        console.log('Transitioning: video -> black');
        setCurrentView('black');
      } else if (currentView === 'black') {
        console.log('Transitioning: black -> dunes');
        setCurrentView('dunes');
      }
    } else if (direction === 'up') {
      if (currentView === 'dunes') {
        console.log('Transitioning: dunes -> black');
        setCurrentView('black');
      } else if (currentView === 'black') {
        console.log('Transitioning: black -> video');
        setCurrentView('video');
      }
    }
    
    // Reset transition state after animation completes - usando um timeout mais longo
    transitionTimeout.current = setTimeout(() => {
      isTransitioning.current = false;
      console.log(`Transition complete, ready for next scroll. Current view is: ${currentView}`);
    }, 1200); // Aumentando ligeiramente para garantir que a transição termine
  }, [currentView]);

  return { 
    currentView, 
    setCurrentView,
    handleViewTransition
  };
};
