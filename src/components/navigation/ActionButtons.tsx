
import { memo } from "react";
import { Volume2, VolumeX, Hexagon } from "lucide-react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface ActionButtonsProps {
  handleHomeClick: (e: React.MouseEvent) => void;
  handleAudioToggle: (e: React.MouseEvent) => void;
  isMuted: boolean;
  isMobile: boolean;
  toggleMobileMenu: (e: React.MouseEvent) => void;
  getTextColor: () => string;
  currentView: ContentView;
}

const ActionButtons = memo(({
  handleHomeClick,
  handleAudioToggle,
  isMuted,
  isMobile,
  toggleMobileMenu,
  getTextColor,
  currentView
}: ActionButtonsProps) => {
  return (
    <>
      <NavigationButton
        onClick={handleHomeClick}
        className="absolute left-4 top-[2.05cm] p-2 transition-all duration-700 rounded-full bg-black/50 hover:bg-black/70"
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
          className={`absolute left-1/2 -translate-x-1/2 top-[2.05cm] p-2 transition-all duration-700 rounded-full ${currentView === 'dunes' ? '' : 'bg-black/50 hover:bg-black/70'}`}
          aria-label="Menu"
        >
          <div className="w-7 h-7 flex flex-col justify-center items-center gap-1.5">
            <div className="wavy-line" style={{ backgroundColor: currentView === 'dunes' ? '#555555' : getTextColor() }}></div>
            <div className="wavy-line" style={{ backgroundColor: currentView === 'dunes' ? '#555555' : getTextColor() }}></div>
            <div className="wavy-line" style={{ backgroundColor: currentView === 'dunes' ? '#555555' : getTextColor() }}></div>
          </div>
          <span className="sr-only">Menu</span>
        </NavigationButton>
      )}

      <NavigationButton
        onClick={handleAudioToggle}
        className="absolute right-4 top-[2.05cm] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-700"
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
