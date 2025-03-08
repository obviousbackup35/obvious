
import { forwardRef, CSSProperties, useEffect, memo, useRef, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoPlayerProps {
  isPlaying: boolean;
  isActive: boolean;
  src: string;
  style?: CSSProperties;
}

export const VideoPlayer = memo(forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ isPlaying, isActive, src, style }, ref) => {
    const isMobile = useIsMobile();
    const videoLoaded = useRef(false);
    
    // Otimizado: useEffect com dependências corretas e limpeza
    useEffect(() => {
      // Otimizado: Carregamento sob demanda (lazy loading)
      if (ref && 'current' in ref && ref.current && !videoLoaded.current) {
        // Marcado como carregado para evitar recargas redundantes
        videoLoaded.current = true;
        
        // Otimizado: Verificar se a URL já está definida para evitar recargas desnecessárias
        if (ref.current.src !== src) {
          ref.current.src = src;
          ref.current.load();
          console.log("Video source loaded:", src);
        }
      }
      
      // Sem lógica de limpeza aqui - será tratado no componente pai
    }, [ref, src]); // Dependências minimizadas e corretas

    // Otimizado: Estilos memoizados para evitar recálculos
    const videoStyles = useMemo(() => ({
      opacity: isPlaying ? (isActive ? 1 : 0) : 0,
      transition: 'opacity 1s ease-in-out',
      // Otimizado: Uso seletivo de willChange apenas quando necessário
      willChange: isPlaying && isActive ? 'opacity' : 'auto',
      objectFit: isMobile ? 'contain' as const : 'cover' as const,
      // Otimizado: Usar transform para acionar compositing de GPU
      transform: isMobile ? 'translate3d(0,0,0) scale(1.15)' : 'translate3d(0,0,0)',
      contain: 'content' as const,
      ...style
    }), [isPlaying, isActive, isMobile, style]);

    return (
      <video
        ref={ref}
        muted
        loop={false}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={videoStyles}
        src={src}
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
