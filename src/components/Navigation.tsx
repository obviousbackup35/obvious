
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
    e.stopPropagation();
    onViewChange(view);
  }, [onViewChange]);

  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('video');
  }, [onViewChange]);

  const handleAudioToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAudio(e);
  }, [toggleAudio]);

  return <div className="absolute top-0 w-full z-50 transition-opacity duration-1000" style={{
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none'
  }}>
      <nav className="absolute top-8 w-full">
        <div className="flex justify-center items-center font-montserrat text-[1.38rem] relative" style={{
          color: '#c8c5ad'
        }}>
          <button onClick={handleHomeClick} className="absolute left-4 top-[1.5cm] p-2 hover:opacity-70 transition-opacity rounded-full bg-black/50 hover:bg-black/70" aria-label="Go to home">
            <Hexagon className="w-7 h-7" style={{
              color: '#c8c5ad'
            }} />
          </button>

          <button onClick={handleAudioToggle} className="absolute right-4 top-[1.5cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
            {isMuted ? <VolumeX className="w-7 h-7" style={{
              color: '#c8c5ad'
            }} /> : <Volume2 className="w-7 h-7" style={{
              color: '#c8c5ad'
            }} />}
          </button>
          
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            <div className="absolute left-1/4 -translate-x-[calc(100%+2rem)] pointer-events-none">
              <button onClick={handleViewChange('company')} className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-px px-[129px] pointer-events-auto">
                C O M P A N Y
              </button>
            </div>
            
            <div className="absolute left-1/4 -translate-x-1/2 pointer-events-none">
              <button onClick={handleViewChange('projects')} className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-[5px] px-[26px] pointer-events-auto">
                P R O J E C T
              </button>
            </div>
            
            <div className="absolute right-1/4 translate-x-1/2 pointer-events-none">
              <button onClick={handleViewChange('gallery')} className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full px-[24px] mx-[5px] pointer-events-auto">
                G A L L E R Y
              </button>
            </div>
            
            <div className="absolute right-1/4 translate-x-[calc(100%+2rem)] pointer-events-none">
              <button onClick={handleViewChange('contact')} className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-0 px-[130px] pointer-events-auto">
                C O N T A C T
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>;
};
