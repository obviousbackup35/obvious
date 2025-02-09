
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
  
  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const videos = event.currentTarget.querySelectorAll('video');
    if (videos.length && !isPlaying) {
      videos.forEach(video => video.play());
      audioRef.current?.play();
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
      if (event.deltaY > 0 && !showBlackScreen) {
        setShowBlackScreen(true);
        
        // Fade out audio
        if (audioRef.current) {
          const fadeInterval = setInterval(() => {
            setAudioVolume(prev => {
              const newVolume = Math.max(0, prev - 0.05);
              audioRef.current!.volume = newVolume;
              if (newVolume === 0) {
                clearInterval(fadeInterval);
              }
              return newVolume;
            });
          }, 50);
        }
      } else if (event.deltaY < 0 && showBlackScreen) {
        setShowBlackScreen(false);
        
        // Fade in audio
        if (audioRef.current) {
          const fadeInterval = setInterval(() => {
            setAudioVolume(prev => {
              const newVolume = Math.min(1, prev + 0.05);
              audioRef.current!.volume = newVolume;
              if (newVolume === 1) {
                clearInterval(fadeInterval);
              }
              return newVolume;
            });
          }, 50);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isPlaying, showBlackScreen]);
  
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
