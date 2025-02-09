
import { useState } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  console.log("Tentando carregar logo de:", "/logo.svg");
  
  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    const video = event.currentTarget.querySelector('video');
    if (video) {
      if (!isPlaying) {
        video.play();
        setIsPlaying(true);
      }
    }
  };
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden cursor-pointer"
      onClick={handleClick}
      onTouchStart={handleClick}
    >
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
          src="/logo.svg"
          alt="Logo"
          className="w-[660px] h-auto"
          style={{ maxWidth: '80vw' }}
          onError={(e) => console.error("Erro ao carregar logo:", e)}
          onLoad={() => console.log("Logo carregado com sucesso")}
        />
      </div>
    </div>
  );
};

export default Index;
