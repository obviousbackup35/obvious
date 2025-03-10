
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useAudio } from "@/contexts/AudioContext";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const { hasInitialInteraction } = useAudio();
  const debounceTimeout = useRef<number | null>(null);
  
  // Manipulador de rolagem simplificado para desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    // Verificar se houve interação inicial
    if (!hasInitialInteraction) {
      console.log("No initial interaction yet, ignoring scroll");
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); // Impedir rolagem padrão
    
    // Usar apenas um simples debounce para evitar eventos múltiplos,
    // mas não bloquear completamente as transições
    if (debounceTimeout.current) {
      return;
    }
    
    // Determinar direção da rolagem
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Registrar evento para depuração
    console.log(`Wheel event detected - direction: ${direction}, deltaY: ${e.deltaY}`);
    
    // Acionar transição de visualização imediatamente
    handleViewTransition(direction);
    
    // Definir debounce para evitar múltiplos eventos em sucessão rápida
    debounceTimeout.current = window.setTimeout(() => {
      debounceTimeout.current = null;
      console.log('Scroll debounce complete, ready for next scroll event');
    }, 500); // Tempo reduzido para melhorar responsividade
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
      // Configuração simplificada para desktop
      window.addEventListener('wheel', handleWheel, { passive: false });
      console.log('Desktop wheel handler registered');
    }
    
    return cleanup;
  }, [isMobile, handleWheel]);
};
