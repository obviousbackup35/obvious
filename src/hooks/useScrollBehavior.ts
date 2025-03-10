
import { useEffect } from "react";
import { useIsMobile } from "./use-mobile";

export const useScrollBehavior = () => {
  const isMobile = useIsMobile();
  
  // Apenas desativamos o efeito de bouncing do scroll, sem realizar transições entre views
  useEffect(() => {
    // Função simples para prevenir eventos padrão
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    
    // Configuração para dispositivos móveis
    if (isMobile) {
      document.documentElement.classList.add('no-bounce');
      document.body.classList.add('no-bounce');
      
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    
    // Função de limpeza
    return () => {
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
    };
  }, [isMobile]);
};
