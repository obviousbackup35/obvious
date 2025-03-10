
import { useCallback, memo, useState, useEffect } from "react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./navigation/NavigationButton";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ActionButtons from "./navigation/ActionButtons";
import { Globe } from "lucide-react";

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
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const mainViews: ContentView[] = ['video', 'company', 'gallery', 'contact'];
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

  const handleLanguageToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
    console.log('Language switched to:', language === 'pt' ? 'en' : 'pt');
  }, [language]);

  const getTextColor = () => {
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
