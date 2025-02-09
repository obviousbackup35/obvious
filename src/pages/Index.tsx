import { useState, useRef, useEffect, useCallback } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(1);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVolumeRef = useRef<number>(1);
  
  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const videos = event.currentTarget.querySelectorAll('video');
    if (videos.length && !isPlaying) {
      videos.forEach(video => video.play());
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.volume = currentVolumeRef.current;
      }
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const handleTimeUpdate = () => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2) return;

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

  useEffect(() => {
    if (!isPlaying) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const fadeStep = 0.05;
      const fadeInterval = 50;

      if (event.deltaY > 0 && !showBlackScreen) {
        setShowBlackScreen(true);
        
        const startFadeOut = () => {
          const newVolume = Math.max(0, currentVolumeRef.current - fadeStep);
          currentVolumeRef.current = newVolume;
          
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
          setAudioVolume(newVolume);
          
          if (newVolume <= 0) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        };

        fadeIntervalRef.current = setInterval(startFadeOut, fadeInterval);
        startFadeOut(); // Inicia o fade imediatamente
      } else if (event.deltaY < 0 && showBlackScreen) {
        setShowBlackScreen(false);
        
        const startFadeIn = () => {
          const newVolume = Math.min(1, currentVolumeRef.current + fadeStep);
          currentVolumeRef.current = newVolume;
          
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
          setAudioVolume(newVolume);
          
          if (newVolume >= 1) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        };

        fadeIntervalRef.current = setInterval(startFadeIn, fadeInterval);
        startFadeIn(); // Inicia o fade imediatamente
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [isPlaying, showBlackScreen]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
      currentVolumeRef.current = audioVolume;
    }
  }, [audioVolume]);
  
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
          backgroundImage: 'url("/fundo.webp")',
          opacity: isBackgroundLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: '1s'
        }}
      />
      <video
        ref={video1Ref}
        muted
        loop={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0"
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
        className="absolute inset-0 w-full h-full object-cover opacity-0"
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
      <div 
        className="absolute inset-0 w-full h-full z-30"
        style={{ 
          backgroundColor: 'black',
          opacity: showBlackScreen ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      />
    </div>
  );
};

export default Index;
