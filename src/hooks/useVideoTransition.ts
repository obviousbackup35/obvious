
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  const timeUpdateFrame = useRef<number>();
  const lastUpdateTime = useRef(0);
  
  // Otimizado: Reduzido throttle para timeupdate para transições mais suaves (50ms)
  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    // Throttle otimizado para garantir transições mais suaves
    if (now - lastUpdateTime.current < 50) return;
    lastUpdateTime.current = now;
    
    // Otimizado: Uso de requestAnimationFrame para sincronização com o ciclo de renderização
    if (timeUpdateFrame.current) {
      cancelAnimationFrame(timeUpdateFrame.current);
    }

    timeUpdateFrame.current = requestAnimationFrame(() => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2 || isTransitioning.current) return;

      // Definir ponto de transição se ainda não estiver definido
      if (transitionPoint.current === 0 && video1.duration) {
        // Otimizado: Margem de segurança para transição (1 segundo antes do fim)
        transitionPoint.current = Math.max(video1.duration - 1, 0);
        console.log("Set transition point:", transitionPoint.current);
      }
      
      // Otimizado: Melhor logging para debug de problemas de transição
      if (activeVideo === 1 && video1.currentTime > 0 && transitionPoint.current > 0) {
        const timeRemaining = transitionPoint.current - video1.currentTime;
        if (timeRemaining < 0.5) {
          console.log(`Video 1 near transition: ${timeRemaining.toFixed(2)}s remaining`);
        }
      } else if (activeVideo === 2 && video2.currentTime > 0 && transitionPoint.current > 0) {
        const timeRemaining = transitionPoint.current - video2.currentTime;
        if (timeRemaining < 0.5) {
          console.log(`Video 2 near transition: ${timeRemaining.toFixed(2)}s remaining`);
        }
      }
      
      // Otimizado: Lógica de transição mais robusta com tratamento adequado de promises
      if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        console.log("Starting transition to video 2");
        
        // Garantir que video2 esteja pronto antes da transição
        video2.currentTime = 0;
        
        // Otimizado: Uso de promise chaining mais estável para playback
        video2.play()
          .then(() => {
            console.log("Transitioned to video 2");
            setActiveVideo(2);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Video 2 playback error:", err);
            // Otimizado: Tentativa adicional com delay em caso de falha
            setTimeout(() => {
              video2.play()
                .then(() => {
                  setActiveVideo(2);
                  isTransitioning.current = false;
                })
                .catch(deepErr => {
                  console.error("Retry video 2 playback failed:", deepErr);
                  isTransitioning.current = false;
                });
            }, 200);
          });
          
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        console.log("Starting transition to video 1");
        
        video1.currentTime = 0;
        
        // Mesmo padrão de tratamento para transição de volta ao vídeo 1
        video1.play()
          .then(() => {
            console.log("Transitioned to video 1");
            setActiveVideo(1);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Video 1 playback error:", err);
            setTimeout(() => {
              video1.play()
                .then(() => {
                  setActiveVideo(1);
                  isTransitioning.current = false;
                })
                .catch(deepErr => {
                  console.error("Retry video 1 playback failed:", deepErr);
                  isTransitioning.current = false;
                });
            }, 200);
          });
      }
    });
  }, [activeVideo]);

  // Otimizado: Limpeza de recursos no unmount sem limpar sources durante operação
  useEffect(() => {
    return () => {
      if (timeUpdateFrame.current) {
        cancelAnimationFrame(timeUpdateFrame.current);
      }
      
      // Limpar vídeos apenas no desmonte completo do componente
      if (video1Ref.current) {
        video1Ref.current.pause();
      }
      
      if (video2Ref.current) {
        video2Ref.current.pause();
      }
    };
  }, []);

  return {
    activeVideo,
    video1Ref,
    video2Ref,
    handleTimeUpdate
  };
};
