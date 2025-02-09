
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    const video = event.currentTarget.querySelector('video');
    if (video) {
      if (!isPlaying) {
        video.play();
        if (audioRef.current) {
          audioRef.current.play();
        }
        setIsPlaying(true);
      }
    }
  };

  // Pré-carrega a imagem de fundo
  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.onload = () => {
      setIsBackgroundLoaded(true);
    };
  }, []);
  
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
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-1000 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          backgroundImage: 'url("/fundo.webp")',
          opacity: isBackgroundLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      <video
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        src="/loft-video.webm"
      />
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-1000 ${
          isBackgroundLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1000ms' }}
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
