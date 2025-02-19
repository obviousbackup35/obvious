
import { Volume2, VolumeX, Hexagon } from "lucide-react";
import { useCallback, memo } from "react";
import type { ContentView } from "@/types/navigation";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
  onViewChange: (view: ContentView) => void;
  currentView: ContentView;
}

const NavigationButton = memo(({ onClick, children, className }: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className: string;
}) => (
  <button 
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
));

NavigationButton.displayName = 'NavigationButton';

export const Navigation = memo(({
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

  return (
    <div 
      className="absolute top-0 w-full z-50 transition-opacity duration-1000" 
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <nav className="absolute top-8 w-full">
        <div 
          className="flex justify-center items-center font-montserrat text-[1.38rem] relative" 
          style={{ color: '#c8c5ad' }}
        >
          <NavigationButton
            onClick={handleHomeClick}
            className="absolute left-4 top-[1.2cm] p-2 hover:opacity-70 transition-opacity rounded-full bg-black/50 hover:bg-black/70"
          >
            <Hexagon className="w-7 h-7" style={{ color: '#c8c5ad' }} />
          </NavigationButton>

          <NavigationButton
            onClick={handleAudioToggle}
            className="absolute right-4 top-[1.2cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            {isMuted ? 
              <VolumeX className="w-7 h-7" style={{ color: '#c8c5ad' }} /> : 
              <Volume2 className="w-7 h-7" style={{ color: '#c8c5ad' }} />
            }
          </NavigationButton>
          
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            <div className="absolute left-1/4 -translate-x-[calc(100%+2rem)] pointer-events-none">
              <NavigationButton
                onClick={handleViewChange('company')}
                className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full pointer-events-auto px-0 mx-[130px]"
              >
                C O M P A N Y
              </NavigationButton>
            </div>
            
            <div className="absolute left-1/4 -translate-x-1/2 pointer-events-none">
              <NavigationButton
                onClick={handleViewChange('projects')}
                className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full pointer-events-auto mx-0 px-0"
              >
                P R O J E C T
              </NavigationButton>
            </div>
            
            <div className="absolute right-1/4 translate-x-1/2 pointer-events-none">
              <NavigationButton
                onClick={handleViewChange('gallery')}
                className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full mx-[5px] pointer-events-auto px-0"
              >
                G A L L E R Y
              </NavigationButton>
            </div>
            
            <div className="absolute right-1/4 translate-x-[calc(100%+2rem)] pointer-events-none">
              <NavigationButton
                onClick={handleViewChange('contact')}
                className="cursor-pointer hover:opacity-70 transition-opacity py-2 rounded-full pointer-events-auto px-0 mx-[133px]"
              >
                C O N T A C T
              </NavigationButton>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
});

Navigation.displayName = 'Navigation';
