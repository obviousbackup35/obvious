
import { useCallback, memo, useState } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./navigation/NavigationButton";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ActionButtons from "./navigation/ActionButtons";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
  onViewChange: (view: ContentView) => void;
  currentView: ContentView;
}

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
    console.log('Mobile menu toggled:', !mobileMenuOpen);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    console.log('Mobile menu closed');
  }, []);

  // Reimplementing adaptive text color based on the current view
  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  return (
    <div 
      className="absolute top-8 w-full z-50 transition-opacity duration-1000" 
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: isVisible ? 'opacity' : 'auto'
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <nav className="absolute top-0 w-full">
        <div 
          className="flex justify-center items-center font-montserrat text-[1.38rem] relative transition-colors duration-700" 
          style={{ color: getTextColor() }}
        >
          <ActionButtons 
            handleHomeClick={handleHomeClick}
            handleAudioToggle={handleAudioToggle}
            isMuted={isMuted}
            isMobile={isMobile}
            toggleMobileMenu={toggleMobileMenu}
            getTextColor={getTextColor}
            currentView={currentView}
            isMobileMenuOpen={mobileMenuOpen}
          />
          
          {isMobile && (
            <MobileMenu 
              isOpen={mobileMenuOpen}
              handleViewChange={handleViewChange}
              closeMobileMenu={closeMobileMenu}
            />
          )}
          
          {!isMobile && (
            <DesktopMenu 
              handleViewChange={handleViewChange}
            />
          )}
        </div>
      </nav>
    </div>
  );
});

Navigation.displayName = 'Navigation';
