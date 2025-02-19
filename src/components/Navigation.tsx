
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

  return (
    <div className="absolute top-0 w-full z-50 transition-opacity duration-1000" style={{
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>
      <nav className="absolute top-4 w-full">
        <div className="flex justify-center items-center font-montserrat text-[1.38rem] relative" style={{
          color: '#c8c5ad'
        }}>
          <button onClick={handleHomeClick} className="absolute left-4 p-2 hover:opacity-70 transition-opacity rounded-full bg-black/50 hover:bg-black/70" aria-label="Go to home">
            <Hexagon className="w-7 h-7" style={{
              color: '#c8c5ad'
            }} />
          </button>
          
          <div className="flex items-center justify-center space-x-16">
            <div className="flex items-center space-x-8 -ml-8"> {/* Adicionado -ml-8 (aproximadamente 0.5cm) */}
              <button onClick={handleViewChange('company')} className="cursor-pointer hover:opacity-70 transition-opacity px-4 py-2 rounded-full">
                C O M P A N Y
              </button>
              <button onClick={handleViewChange('projects')} className="cursor-pointer hover:opacity-70 transition-opacity px-4 py-2 rounded-full">
                P R O J E C T
              </button>
            </div>

            <div className="w-32" />

            <div className="flex items-center space-x-8">
              <button onClick={handleViewChange('gallery')} className="cursor-pointer hover:opacity-70 transition-opacity px-4 py-2 rounded-full">
                G A L L E R Y
              </button>
              <button onClick={handleViewChange('contact')} className="cursor-pointer hover:opacity-70 transition-opacity px-4 py-2 rounded-full">
                C O N T A C T
              </button>
            </div>
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
    </div>
  );
};
