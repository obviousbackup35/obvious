
import { memo } from "react";
import { Volume2, VolumeX, Hexagon, Menu, X, RefreshCw } from "lucide-react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface ActionButtonsProps {
  handleHomeClick: (e: React.MouseEvent) => void;
  handleAudioToggle: (e: React.MouseEvent) => void;
  isPlaying: boolean;
  isMobile: boolean;
  toggleMobileMenu: (e: React.MouseEvent) => void;
  getTextColor: () => string;
  currentView: ContentView;
  isMobileMenuOpen: boolean;
}

const ActionButtons = memo(({
  handleHomeClick,
  handleAudioToggle,
  isPlaying,
  isMobile,
  toggleMobileMenu,
  getTextColor,
  currentView,
  isMobileMenuOpen
}: ActionButtonsProps) => {
  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.reload();
  };

  return (
    <>
      <NavigationButton
        onClick={handleHomeClick}
        className="absolute left-4 top-[1.75cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
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
          className={`mobile-menu-toggle absolute left-1/2 -translate-x-1/2 top-[1.75cm] p-2 transition-all duration-700 rounded-full z-50 ${
            isMobileMenuOpen ? 'bg-black/70' : currentView === 'dunes' ? '' : 'bg-black/50 hover:bg-black/70'
          }`}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <X 
              className="w-7 h-7" 
              style={{ 
                color: '#ffffff',
                transition: 'color 0.7s ease-in-out' 
              }} 
              aria-hidden="true"
            />
          ) : (
            <Menu 
              className="w-7 h-7" 
              style={{ 
                color: currentView === 'dunes' ? '#555555' : getTextColor(), 
                transition: 'color 0.7s ease-in-out' 
              }} 
              aria-hidden="true"
            />
          )}
          <span className="sr-only">{isMobileMenuOpen ? 'Close Menu' : 'Menu'}</span>
        </NavigationButton>
      )}

      <NavigationButton
        onClick={handleAudioToggle}
        className="absolute right-4 top-[1.75cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-700"
      >
        {!isPlaying ? 
          <VolumeX className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" /> : 
          <Volume2 className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" />
        }
        <span className="sr-only">{!isPlaying ? 'Play' : 'Pause'}</span>
      </NavigationButton>
    </>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
