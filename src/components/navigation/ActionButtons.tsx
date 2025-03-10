
import { memo } from "react";
import { Volume2, VolumeX, Menu, X } from "lucide-react";
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
  handleAudioToggle,
  isPlaying,
  isMobile,
  toggleMobileMenu,
  getTextColor,
  isMobileMenuOpen
}: ActionButtonsProps) => {
  // Audio icon size decreased by 10% from 46.68px
  const audioIconSize = "42.012px";
  
  return (
    <>
      {/* Mobile menu button - completely separate from audio button */}
      {isMobile && (
        <div className="mobile-menu-container">
          <NavigationButton
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle absolute left-1/2 -translate-x-1/2 transform top-[13.5cm] p-2 transition-all duration-700 z-50"
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
                  color: getTextColor(), 
                  transition: 'color 0.7s ease-in-out' 
                }} 
                aria-hidden="true"
              />
            )}
            <span className="sr-only">{isMobileMenuOpen ? 'Close Menu' : 'Menu'}</span>
          </NavigationButton>
        </div>
      )}

      {/* Audio button - completely separate component */}
      <div className="audio-control-container">
        <NavigationButton
          onClick={handleAudioToggle}
          className="audio-control-button absolute right-[2.15rem] top-[calc(50%+80px)] transform -translate-y-1/2 p-2 transition-all duration-700"
          aria-label={!isPlaying ? 'Play Audio' : 'Pause Audio'}
        >
          {!isPlaying ? 
            <VolumeX 
              width={audioIconSize} 
              height={audioIconSize} 
              style={{ 
                color: getTextColor(), 
                transition: 'color 0.7s ease-in-out' 
              }} 
              aria-hidden="true" 
            /> : 
            <Volume2 
              width={audioIconSize} 
              height={audioIconSize} 
              style={{ 
                color: getTextColor(), 
                transition: 'color 0.7s ease-in-out' 
              }} 
              aria-hidden="true" 
            />
          }
          <span className="sr-only">{!isPlaying ? 'Play' : 'Pause'}</span>
        </NavigationButton>
      </div>
    </>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
