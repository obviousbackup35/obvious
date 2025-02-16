
import { Volume2, VolumeX, Hexagon } from "lucide-react";

type ContentView = 'video' | 'dunes' | 'company' | 'projects' | 'gallery' | 'contact';

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
  const handleViewChange = (view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange(view);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('video');
  };

  return (
    <div 
      className="absolute top-0 w-full z-50 transition-opacity duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <nav className="absolute top-4 w-full">
        <div className="flex justify-center items-center font-montserrat text-[#CABA9F] text-[1.15rem] relative">
          <button
            onClick={handleHomeClick}
            className="absolute left-4 p-2 hover:opacity-70 transition-opacity"
            aria-label="Go to home"
          >
            <Hexagon className="w-6 h-6 text-[#CABA9F]" />
          </button>
          <button onClick={handleViewChange('company')} className="cursor-pointer hover:opacity-70 transition-opacity">C O M P A N Y</button>
          <span className="mx-16" />
          <button onClick={handleViewChange('projects')} className="cursor-pointer hover:opacity-70 transition-opacity">P R O J E C T S</button>
          <span className="mx-32" />
          <button onClick={handleViewChange('gallery')} className="cursor-pointer hover:opacity-70 transition-opacity">G A L L E R Y</button>
          <span className="mx-16" />
          <button onClick={handleViewChange('contact')} className="cursor-pointer hover:opacity-70 transition-opacity">C O N T A C T</button>
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
  );
};
