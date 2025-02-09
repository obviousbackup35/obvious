
import { useState, useRef, useEffect, useCallback } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  
  // Memoiza o handler de click para evitar recriações desnecessárias
  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying) {
      const videos = event.currentTarget.querySelectorAll('video');
      videos.forEach(video => video.play());
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Pré-carrega a imagem de fundo
  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  // Gerencia a transição suave entre os vídeos
  useEffect(() => {
    if (!isPlaying) return;

    const handleTimeUpdate = () => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2) return;

      // Inicia a transição 1 segundo antes do fim do vídeo
      const transitionPoint = video1.duration - 1;
      
      if (activeVideo === 1 && video1.currentTime >= transitionPoint) {
        video2.currentTime = 0;
        video2.play();
        setActiveVideo(2);
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint) {
        video1.currentTime = 0;
        video1.play();
        setActiveVideo(1);
      }
    };

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    video1?.addEventListener('timeupdate', handleTimeUpdate);
    video2?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video1?.removeEventListener('timeupdate', handleTimeUpdate);
      video2?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isPlaying, activeVideo]);
  
  // Classes comuns para os vídeos
  const commonVideoClasses = "absolute inset-0 w-full h-full object-cover opacity-0";
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden cursor-pointer bg-white"
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
      />
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: isPlaying ? 'none' : 'url("/fundo.webp")',
          backgroundColor: isPlaying ? 'black' : 'transparent',
          opacity: isBackgroundLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      <video
        ref={video1Ref}
        muted
        loop={false}
        playsInline
        className={commonVideoClasses}
        style={{
          opacity: isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        src="/loft-video.webm"
      />
      <video
        ref={video2Ref}
        muted
        loop={false}
        playsInline
        className={commonVideoClasses}
        style={{
          opacity: isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        src="/loft-video.webm"
      />
      <div 
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{ 
          opacity: isBackgroundLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: '1000ms'
        }}
      >
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-[660px] h-auto"
          style={{ maxWidth: '80vw' }}
        />
      </div>
    </div>
  );
};

export default Index;
