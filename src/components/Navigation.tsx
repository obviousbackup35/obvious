
import { Volume2, VolumeX, Hexagon } from "lucide-react";
import { useCallback } from "react";
import type { ContentView } from "@/types/navigation";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
  onViewChange: (view: ContentView) => void;
  currentView: ContentView;
}

export const Navigation = ({
  audioRef,
  isMuted,
  toggleAudio,
  isVisible = true,
  onViewChange,
  currentView
}: NavigationProps) => {
  const handleViewChange = useCallback((view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange(view);
  }, [onViewChange]);

  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('video');
  }, [onViewChange]);

  return <div className="absolute top-0 w-full z-50 transition-opacity duration-1000" style={{
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none'
  }}>
      <nav className="absolute top-8 w-full">
        <div className="flex justify-center items-center font-montserrat text-[1.38rem] relative" style={{
          color: '#c8c5ad'
        }}>
          <button onClick={handleHomeClick} className="absolute left-4 p-2 hover:opacity-70 transition-opacity rounded-full bg-black/50 hover:bg-black/70" aria-label="Go to home">
            <Hexagon className="w-7 h-7" style={{
              color: '#c8c5ad'
            }} />
          </button>
          
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            <button onClick={handleViewChange('company')} className="absolute left-1/4 -translate-x-[calc(100%+2rem)] cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-px px-[129px]">
              C O M P A N Y
            </button>
            
            <button onClick={handleViewChange('projects')} className="absolute left-1/4 -translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-[5px] px-[26px]">
              P R O J E C T
            </button>
            
            <button onClick={handleViewChange('gallery')} className="absolute right-1/4 translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full px-[24px] mx-[5px]">
              G A L L E R Y
            </button>
            
            <button onClick={handleViewChange('contact')} className="absolute right-1/4 translate-x-[calc(100%+2rem)] cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full px-[121px]">
              C O N T A C T
            </button>
          </div>
        </div>
      </nav>

      <button onClick={toggleAudio} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
        {isMuted ? <VolumeX className="w-7 h-7" style={{
          color: '#c8c5ad'
        }} /> : <Volume2 className="w-7 h-7" style={{
          color: '#c8c5ad'
        }} />}
      </button>
    </div>;
};
