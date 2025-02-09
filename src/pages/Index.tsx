
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const bgImage = new Image();
    const logoImage = new Image();
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setAssetsLoaded(true);
      }
    };

    bgImage.onload = checkAllLoaded;
    logoImage.onload = checkAllLoaded;

    bgImage.src = "/fundo.webp";
    logoImage.src = "/logo.svg";
  }, []);
  
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
  
  // Se os assets ainda não carregaram, mostramos uma div vazia preta
  if (!assetsLoaded) {
    return <div className="bg-black w-full h-screen" />;
  }
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden cursor-pointer"
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
        style={{ backgroundImage: 'url("/fundo.webp")' }}
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
        className="absolute inset-0 flex items-center justify-center opacity-0 animate-[fade-in_4000ms_ease-in-out_forwards] z-20"
      >
        <img
          ref={logoRef}
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
