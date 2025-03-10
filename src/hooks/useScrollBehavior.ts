
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useAudio } from "@/contexts/AudioContext";

export const useScrollBehavior = (handleViewTransition: (direction: 'up' | 'down') => void) => {
  const isMobile = useIsMobile();
  const { isPlaying, hasInitialInteraction } = useAudio();
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const lastDirection = useRef<'up' | 'down' | null>(null);
  
  // Manipulador de evento de roda com detecção aprimorada
  const throttledWheelHandler = useCallback((e: WheelEvent) => {
    // Não tratar eventos de rolagem se o usuário ainda não interagiu com o site
    if (!hasInitialInteraction) {
      console.log("No initial interaction yet, ignoring scroll");
      e.preventDefault();
      return;
    }
    
    e.preventDefault(); // Impedir a rolagem padrão
    
    // Se já estiver rolando, ignore
    if (isScrolling.current) {
      return;
    }
    
    // Processamento aprimorado de eventos de rolagem
    const now = Date.now();
    const direction = e.deltaY > 0 ? 'down' : 'up';
    const significantScroll = Math.abs(e.deltaY) > 5; // Threshold para detectar rolagens
    
    if (!significantScroll) return;
    
    // Tempo suficiente passou desde o último evento de rolagem?
    if (now - lastScrollTime.current < 100) {
      return;
    }
    
    console.log(`Wheel event - direction: ${direction}, deltaY: ${e.deltaY}`);
    
    // Atualizar variáveis de rastreamento
    lastDirection.current = direction;
    lastScrollTime.current = now;
    isScrolling.current = true;
    
    // Acionar transição de visualização imediatamente para responsividade melhor
    console.log(`Initiating transition with direction: ${direction}`);
    handleViewTransition(direction);
    
    // Redefinir estado de rolagem após atraso
    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current);
    }
    
    // Aumentar o tempo limite para corresponder à duração da transição de visualização
    scrollTimeout.current = window.setTimeout(() => {
      isScrolling.current = false;
      lastDirection.current = null;
      scrollTimeout.current = null;
      console.log('Scroll cooldown complete, ready for next scroll event');
    }, 1000); // Reduza para experiência mais responsiva
  }, [handleViewTransition, hasInitialInteraction]);

  useEffect(() => {
    // Função de limpeza a ser chamada na desmontagem
    const cleanup = () => {
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', throttledWheelHandler);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
    
    // Função reutilizável preventDefault
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    if (isMobile) {
      // Configuração específica para dispositivos móveis
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      // Impedir eventos padrão de roda e toque
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      // Configuração específica para desktop - Usando passive: false para permitir preventDefault
      window.addEventListener('wheel', throttledWheelHandler, { passive: false });
    }
    
    // Retorna função de limpeza
    return cleanup;
  }, [isMobile, throttledWheelHandler]);
};
