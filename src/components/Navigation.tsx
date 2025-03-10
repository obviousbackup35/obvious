
import { useCallback, memo, useState } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./navigation/NavigationButton";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ActionButtons from "./navigation/ActionButtons";
import HexagonButton from "./navigation/HexagonButton";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
  onViewChange: (view: ContentView) => void;
  currentView: ContentView;
  textColor: string;
  isDunesVisible: boolean;
  toggleDunes: () => void;
}

export const Navigation = memo(({
  audioRef,
  isPlaying,
  toggleAudio,
  isVisible = true,
  onViewChange,
  currentView,
  textColor,
  isDunesVisible,
  toggleDunes
}: NavigationProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewChange = useCallback((view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange(view);
    setMobileMenuOpen(false);
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

  const toggleMobileMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div 
      className="fixed top-8 w-full z-50 transition-opacity duration-1000" 
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <nav className="w-full">
        <div 
          className="flex justify-center items-center font-montserrat text-[1.38rem] relative transition-colors duration-700" 
          style={{ color: textColor }}
        >
          <ActionButtons 
            handleHomeClick={handleHomeClick}
            handleAudioToggle={handleAudioToggle}
            isPlaying={isPlaying}
            isMobile={isMobile}
            toggleMobileMenu={toggleMobileMenu}
            getTextColor={() => textColor}
            currentView={currentView}
            isMobileMenuOpen={mobileMenuOpen}
          />
          
          <HexagonButton 
            onViewChange={onViewChange} 
            textColor={textColor} 
            isDunesVisible={isDunesVisible}
            toggleDunes={toggleDunes}
          />
          
          {isMobile && (
            <MobileMenu 
              isOpen={mobileMenuOpen}
              handleViewChange={handleViewChange}
              closeMobileMenu={() => setMobileMenuOpen(false)}
              getTextColor={() => textColor}
            />
          )}
          
          {!isMobile && (
            <DesktopMenu 
              handleViewChange={handleViewChange}
              textColor={textColor}
            />
          )}
        </div>
      </nav>
    </div>
  );
});

Navigation.displayName = 'Navigation';
