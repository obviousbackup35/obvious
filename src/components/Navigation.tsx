
import { Volume2, VolumeX, Hexagon, Menu } from "lucide-react";
import { useCallback, memo, useState } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewChange = useCallback((view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange(view);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [onViewChange, isMobile]);

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

  const toggleMobileMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
  }, []);

  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  return (
    <div 
      className="absolute top-0 w-full z-50 transition-opacity duration-1000" 
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: isVisible ? 'opacity' : 'auto'
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <nav className="absolute top-4 w-full">
        <div 
          className="flex justify-center items-center font-montserrat text-[1.38rem] relative transition-colors duration-700" 
          style={{ color: getTextColor() }}
        >
          <NavigationButton
            onClick={handleHomeClick}
            className="absolute left-4 top-[0.6cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
          >
            <Hexagon 
              className="w-7 h-7" 
              style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
              aria-hidden="true"
            />
            <span className="sr-only">Home</span>
          </NavigationButton>

          {isMobile && (
            <NavigationButton
              onClick={toggleMobileMenu}
              className="absolute left-1/2 -translate-x-1/2 top-[0.6cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
            >
              <Menu 
                className="w-7 h-7" 
                style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
                aria-hidden="true"
              />
              <span className="sr-only">Menu</span>
            </NavigationButton>
          )}

          <NavigationButton
            onClick={handleAudioToggle}
            className="absolute right-4 top-[0.6cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-700"
          >
            {isMuted ? 
              <VolumeX className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" /> : 
              <Volume2 className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" />
            }
            <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          </NavigationButton>
          
          {isMobile ? (
            <div 
              className={`absolute top-24 left-0 w-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              style={{ 
                willChange: mobileMenuOpen ? 'opacity, transform' : 'auto'
              }}
            >
              <div className="bg-black/70 backdrop-blur-sm rounded-lg mx-4 p-4 text-center">
                <ul className="space-y-4">
                  <li>
                    <NavigationButton
                      onClick={handleViewChange('company')}
                      className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
                    >
                      C O M P A N Y
                    </NavigationButton>
                  </li>
                  <li>
                    <NavigationButton
                      onClick={handleViewChange('projects')}
                      className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
                    >
                      P R O D U C T
                    </NavigationButton>
                  </li>
                  <li>
                    <NavigationButton
                      onClick={handleViewChange('gallery')}
                      className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
                    >
                      G A L L E R Y
                    </NavigationButton>
                  </li>
                  <li>
                    <NavigationButton
                      onClick={handleViewChange('contact')}
                      className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
                    >
                      C O N T A C T
                    </NavigationButton>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-4xl flex justify-center items-center">
              <div className="absolute left-1/4 -translate-x-[calc(100%+2rem)] pointer-events-none">
                <NavigationButton
                  onClick={handleViewChange('company')}
                  className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto px-0 mx-[130px]"
                >
                  C O M P A N Y
                </NavigationButton>
              </div>
              
              <div className="absolute left-1/4 -translate-x-1/2 pointer-events-none">
                <NavigationButton
                  onClick={handleViewChange('projects')}
                  className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto mx-0 px-0"
                >
                  P R O D U C T
                </NavigationButton>
              </div>
              
              <div className="absolute right-1/4 translate-x-1/2 pointer-events-none">
                <NavigationButton
                  onClick={handleViewChange('gallery')}
                  className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full mx-[5px] pointer-events-auto px-0"
                >
                  G A L L E R Y
                </NavigationButton>
              </div>
              
              <div className="absolute right-1/4 translate-x-[calc(100%+2rem)] pointer-events-none">
                <NavigationButton
                  onClick={handleViewChange('contact')}
                  className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto px-0 mx-[133px]"
                >
                  C O N T A C T
                </NavigationButton>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
});

Navigation.displayName = 'Navigation';
