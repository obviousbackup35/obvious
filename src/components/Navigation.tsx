
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from "lucide-react";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
}

export const Navigation = ({ audioRef, isMuted, toggleAudio, isVisible = true }: NavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path, { replace: true });
      setIsNavigating(false);
    }, 1000);
  };

  return (
    <>
      <div 
        className="absolute top-0 w-full z-50 transition-opacity duration-1000"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        <nav className="absolute top-4 w-full">
          <div className="flex justify-center font-montserrat text-[#CABA9F] text-[1.15rem]">
            <a href="/company" onClick={handleNavigation('/company')} className="cursor-pointer">C O M P A N Y</a>
            <span className="mx-16" />
            <a href="/projects" onClick={handleNavigation('/projects')} className="cursor-pointer">P R O J E C T S</a>
            <span className="mx-32" />
            <a href="/gallery" onClick={handleNavigation('/gallery')} className="cursor-pointer">G A L L E R Y</a>
            <span className="mx-16" />
            <a href="/contact" onClick={handleNavigation('/contact')} className="cursor-pointer">C O N T A C T</a>
          </div>
        </nav>

        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div 
        className={`absolute inset-0 w-full h-full bg-white z-[60] transition-opacity duration-1000 ${
          isNavigating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};
