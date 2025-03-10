import { useCallback, memo, useState, useEffect } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./navigation/NavigationButton";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ActionButtons from "./navigation/ActionButtons";
import { UserRound, Globe } from "lucide-react";
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

  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const mainViews: ContentView[] = ['video', 'dunes', 'company', 'gallery', 'contact'];
    if (mainViews.includes(currentView)) {
      sessionStorage.setItem('lastMainView', currentView);
    }
  }, [currentView]);

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

  const handleAuthClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentView === 'auth') {
      const lastMainView = sessionStorage.getItem('lastMainView') || 'video';
      onViewChange(lastMainView as ContentView);
    } else {
      if (currentView !== 'profile') {
        sessionStorage.setItem('lastMainView', currentView);
      }
      onViewChange('auth');
    }
  }, [onViewChange, currentView]);

  const handleProfileClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentView === 'profile') {
      const lastMainView = sessionStorage.getItem('lastMainView') || 'video';
      onViewChange(lastMainView as ContentView);
    } else {
      if (currentView !== 'auth') {
        sessionStorage.setItem('lastMainView', currentView);
      }
      onViewChange('profile');
    }
  }, [onViewChange, currentView]);

  const handleLanguageToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
    console.log('Language switched to:', language === 'pt' ? 'en' : 'pt');
  }, [language]);

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
          <NavigationButton
            onClick={handleLanguageToggle}
            className="cursor-pointer hover:opacity-70 transition-colors duration-300 rounded-full p-2 absolute left-[1.75rem] top-0"
            style={{ color: getTextColor() }}
          >
            <Globe size={30} />
            <span className="sr-only">Toggle Language</span>
          </NavigationButton>
          
          <NavigationButton
            onClick={user ? handleProfileClick : handleAuthClick}
            className="cursor-pointer hover:opacity-70 transition-colors duration-300 rounded-full p-2 absolute right-[1.75rem] top-0"
            style={{ color: getTextColor() }}
            aria-label={user ? "Profile" : "Login"}
          >
            <UserRound size={30} />
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
