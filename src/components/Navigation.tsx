
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from "lucide-react";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
}

export const Navigation = ({ audioRef, isMuted, toggleAudio }: NavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Adiciona um pequeno delay antes de mostrar o menu para criar o efeito de fade
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  return (
    <>
      <nav className={`absolute top-4 w-full z-50 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex justify-center font-montserrat text-[#CABA9F] text-[1.15rem]">
          <a href="/company" className="cursor-pointer transition-opacity duration-1000" onClick={handleNavigation('/company')}>C O M P A N Y</a>
          <span className="mx-16" />
          <a href="/projects" className="cursor-pointer transition-opacity duration-1000" onClick={handleNavigation('/projects')}>P R O J E C T S</a>
          <span className="mx-32" />
          <a href="/gallery" className="cursor-pointer transition-opacity duration-1000" onClick={handleNavigation('/gallery')}>G A L L E R Y</a>
          <span className="mx-16" />
          <a href="/contact" className="cursor-pointer transition-opacity duration-1000" onClick={handleNavigation('/contact')}>C O N T A C T</a>
        </div>
      </nav>

      <button
        onClick={toggleAudio}
        className={`absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>

      <div 
        className={`absolute inset-0 w-full h-full bg-white z-[60] transition-opacity duration-1000 ${
          isNavigating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};
