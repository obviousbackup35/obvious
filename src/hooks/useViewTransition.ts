
import { useState, useCallback, useEffect } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isMobile = useIsMobile();
  
  // Logs para depuração
  useEffect(() => {
    console.log(`View transition - Current view changed to: ${currentView}, isMobile: ${isMobile}`);
  }, [currentView, isMobile]);

  // Manipulador de transição garantindo que a camada preta seja sempre usada
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    console.log(`View transition triggered - Direction: ${direction}, Current view: ${currentView}`);
    
    // Lógica de transição com transição preta obrigatória
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
  }, [currentView]);

  return { 
    currentView, 
    setCurrentView,
    handleViewTransition
  };
};
