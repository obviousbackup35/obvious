
import { useCallback, memo, useState, useEffect } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./navigation/NavigationButton";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ActionButtons from "./navigation/ActionButtons";
import { UserRound, Globe } from "lucide-react"; // Added Globe icon import
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface NavigationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  isVisible?: boolean;
  onViewChange: (view: ContentView) => void;
  currentView: ContentView;
}

export const Navigation = memo(({
  audioRef,
  isPlaying,
  toggleAudio,
  isVisible = true,
  onViewChange,
  currentView
}: NavigationProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Add state for language
  const [language, setLanguage] = useState('pt'); // Default language is Portuguese

  const handleViewChange = useCallback((view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange(view);
    
    // Close the menu after view change
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

  const handleAuthClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/auth');
  }, [navigate]);

  const handleProfileClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('profile');
  }, [onViewChange]);

  // Add language toggle handler
  const handleLanguageToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
    // Here you would implement actual language switching logic
    console.log('Language switched to:', language === 'pt' ? 'en' : 'pt');
  }, [language]);

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
        willChange: 'opacity'
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <nav className="absolute top-0 w-full">
        <div 
          className="flex justify-center items-center font-montserrat text-[1.38rem] relative transition-colors duration-700" 
          style={{ color: getTextColor() }}
        >
          {/* Language toggle button at top left */}
          <NavigationButton
            onClick={handleLanguageToggle}
            className="cursor-pointer hover:opacity-70 transition-colors duration-300 rounded-full p-2 absolute left-[1.75rem] top-0"
            style={{ color: getTextColor() }}
          >
            <Globe size={30} />
            <span className="sr-only">Toggle Language</span>
          </NavigationButton>
          
          {/* Login/profile button at top right */}
          <NavigationButton
            onClick={user ? handleProfileClick : handleAuthClick}
            className="cursor-pointer hover:opacity-70 transition-colors duration-300 rounded-full p-2 absolute right-[1.75rem] top-0"
            style={{ color: getTextColor() }}
          >
            <UserRound size={30} /> {/* Reduced size from 32 to 30 (approx 5% smaller) */}
          </NavigationButton>

          <ActionButtons 
            handleHomeClick={handleHomeClick}
            handleAudioToggle={handleAudioToggle}
            isPlaying={isPlaying}
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
              closeMobileMenu={() => setMobileMenuOpen(false)}
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
