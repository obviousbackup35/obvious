
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useAudio } from "@/contexts/AudioContext";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const { hasInitialInteraction } = useAudio();
  const debounceTimeout = useRef<number | null>(null);
  const isTransitioning = useRef<boolean>(false);
  
  // Manipulador de rolagem para desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    // Verificar se houve interação inicial
    if (!hasInitialInteraction) {
      console.log("No initial interaction yet, ignoring scroll");
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); // Impedir rolagem padrão
    
    // Evitar múltiplas chamadas durante uma transição
    if (isTransitioning.current || debounceTimeout.current) {
      return;
    }
    
    // Marcar que estamos em transição
    isTransitioning.current = true;
    
    // Determinar direção da rolagem
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Registrar evento para depuração
    console.log(`Wheel event detected - direction: ${direction}, deltaY: ${e.deltaY}`);
    
    // Acionar transição de visualização
    handleViewTransition(direction);
    
    // Definir debounce para evitar múltiplos eventos em sucessão rápida
    debounceTimeout.current = window.setTimeout(() => {
      debounceTimeout.current = null;
      isTransitioning.current = false;
      console.log('Scroll debounce complete, ready for next scroll event');
    }, 1000); // Tempo suficiente para permitir a transição completa
  }, [handleViewTransition, hasInitialInteraction]);

  useEffect(() => {
    // Função de limpeza
    const cleanup = () => {
      if (debounceTimeout.current) {
        window.clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
      
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
    
    // Função simples para prevenir eventos padrão
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    if (isMobile) {
      // Configuração para dispositivos móveis
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      // Configuração para desktop
      window.addEventListener('wheel', handleWheel, { passive: false });
      console.log('Desktop wheel handler registered');
    }
    
    return cleanup;
  }, [isMobile, handleWheel]);
};
