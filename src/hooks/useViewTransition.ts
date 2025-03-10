
import { useState } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isMobile = useIsMobile();
  
  // Mantém a função vazia, apenas para interface compatível
  const handleViewTransition = () => {
    // Função vazia, o scroll não faz mais nada
    console.log('View transitions by scroll have been disabled');
  };

  return { 
    currentView, 
    setCurrentView,
    handleViewTransition
  };
};
