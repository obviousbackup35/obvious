
import { memo } from "react";
import { Volume2, VolumeX, Hexagon, Menu } from "lucide-react";
import { NavigationButton } from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface ControlButtonsProps {
  getTextColor: () => string;
  handleHomeClick: (e: React.MouseEvent) => void;
  handleAudioToggle: (e: React.MouseEvent) => void;
  toggleMobileMenu: (e: React.MouseEvent) => void;
  isMuted: boolean;
  isMobile: boolean;
}

export const ControlButtons = memo(({ 
  getTextColor, 
  handleHomeClick, 
  handleAudioToggle, 
  toggleMobileMenu,
  isMuted, 
  isMobile 
}: ControlButtonsProps) => {
  return (
    <>
      <NavigationButton
        onClick={handleHomeClick}
        className="absolute left-4 top-[1.2cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
        ariaLabel="Home"
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
          className="absolute left-1/2 -translate-x-1/2 top-[1.2cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
          ariaLabel="Menu"
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
        className="absolute right-4 top-[1.2cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-700"
        ariaLabel={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? 
          <VolumeX className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" /> : 
          <Volume2 className="w-7 h-7" style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} aria-hidden="true" />
        }
        <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
      </NavigationButton>
    </>
  );
});

ControlButtons.displayName = 'ControlButtons';
