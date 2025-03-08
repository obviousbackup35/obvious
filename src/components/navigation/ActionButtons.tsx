
import { memo } from "react";
import { Volume2, VolumeX, Hexagon, Menu } from "lucide-react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface ActionButtonsProps {
  handleHomeClick: (e: React.MouseEvent) => void;
  handleAudioToggle: (e: React.MouseEvent) => void;
  isMuted: boolean;
  isMobile: boolean;
  toggleMobileMenu: (e: React.MouseEvent) => void;
  getTextColor: () => string;
}

const ActionButtons = memo(({
  handleHomeClick,
  handleAudioToggle,
  isMuted,
  isMobile,
  toggleMobileMenu,
  getTextColor
}: ActionButtonsProps) => {
  return (
    <>
      <NavigationButton
        onClick={handleHomeClick}
        className="absolute left-4 top-[1.55cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
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
          className="absolute left-1/2 -translate-x-1/2 top-[1.55cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
          aria-label="Menu"
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
        className="absolute right-4 top-[1.55cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-700"
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

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
