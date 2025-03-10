
import { useState, useCallback, useEffect, useRef } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isMobile = useIsMobile();
  const autoTransitionTimeout = useRef<number | null>(null);
  
  // Logs para depuração
  useEffect(() => {
    console.log(`View transition - Current view changed to: ${currentView}, isMobile: ${isMobile}`);
    
    // Se a view atual for 'black', programar transição automática para 'dunes' após um delay
    if (currentView === 'black') {
      console.log('Setting up auto-transition from black to dunes');
      // Limpar qualquer timeout existente
      if (autoTransitionTimeout.current !== null) {
        window.clearTimeout(autoTransitionTimeout.current);
      }
      
      // Configurar novo timeout para transição automática
      autoTransitionTimeout.current = window.setTimeout(() => {
        console.log('Auto-transitioning: black -> dunes');
        setCurrentView('dunes');
        autoTransitionTimeout.current = null;
      }, 800); // Delay curto o suficiente para ser perceptível, mas não irritante
    }
    
    return () => {
      // Limpar o timeout quando o componente for desmontado ou a view mudar
      if (autoTransitionTimeout.current !== null) {
        window.clearTimeout(autoTransitionTimeout.current);
        autoTransitionTimeout.current = null;
      }
    };
  }, [currentView, isMobile]);

  // Manipulador de transição com tela preta intermediária e sem bloqueios
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    console.log(`View transition triggered - Direction: ${direction}, Current view: ${currentView}`);
    
    // Lógica de transição simplificada
    if (direction === 'down') {
      if (currentView === 'video') {
        console.log('Transitioning: video -> black');
        setCurrentView('black');
        // Nota: A transição para 'dunes' será manipulada pelo useEffect acima
      } else if (currentView === 'dunes') {
        // Permitir transições adicionais a partir das dunas, se necessário
        console.log('Already at dunes, no further downward transition');
      } else if (currentView !== 'black') {
        // Para outras views, voltar para 'dunes'
        console.log('Transitioning to dunes from other view');
        setCurrentView('dunes');
      }
    } else if (direction === 'up') {
      if (currentView === 'dunes') {
        console.log('Transitioning: dunes -> black');
        setCurrentView('black');
        // Transição automática será para 'video' através do useEffect
      } else if (currentView === 'black') {
        console.log('Transitioning: black -> video');
        setCurrentView('video');
      } else if (currentView !== 'video') {
        // Para outras views, voltar para 'video'
        console.log('Transitioning to video from other view');
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
