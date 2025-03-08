
import { memo, useRef, useMemo, useCallback, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  // Memoize styles to prevent recalculations on re-renders
  const menuStyles = useMemo(() => ({
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
    transition: 'opacity 600ms ease-in-out, visibility 600ms ease-in-out',
    willChange: isOpen ? 'opacity, visibility' : 'auto',
    contain: 'content' as const,
  }), [isOpen]);
  
  const containerStyles = useMemo(() => ({
    transform: isOpen ? 'translate3d(0,0,0)' : 'translate3d(0,-20px,0)',
    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: isOpen ? 'transform' : 'auto',
    contain: 'layout style' as const,
  }), [isOpen]);
  
  // Use optimized callbacks for event handlers
  const handleCompanyClick = useCallback(handleViewChange('company'), [handleViewChange]);
  const handleProductClick = useCallback(handleViewChange('projects'), [handleViewChange]);
  const handleGalleryClick = useCallback(handleViewChange('gallery'), [handleViewChange]);
  const handleContactClick = useCallback(handleViewChange('contact'), [handleViewChange]);

  // Handle clicks outside the menu content
  useEffect(() => {
    const handleBackdropClick = (e: MouseEvent) => {
      if (isOpen && backdropRef.current && backdropRef.current === e.target) {
        console.log('Backdrop clicked via effect - closing menu');
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleBackdropClick);
    
    return () => {
      document.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen, closeMobileMenu]);

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
      style={menuStyles}
      aria-hidden={!isOpen}
      id="mobile-menu"
    >
      {/* Backdrop element - specifically for handling clicks outside the menu */}
      <div 
        ref={backdropRef}
        className="absolute inset-0" 
        onClick={(e) => {
          // Only trigger if this exact element was clicked (not children)
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            console.log('Backdrop clicked - closing menu');
            closeMobileMenu();
          }
        }}
        data-testid="mobile-menu-backdrop"
      />
      
      {/* Menu content */}
      <div 
        ref={menuRef}
        className="flex items-center justify-center h-full relative z-10"
        style={containerStyles}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on menu from closing it
      >
        <div className="menu-items content-visibility-auto">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleCompanyClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleProductClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleGalleryClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleContactClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                C O N T A C T
              </NavigationButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
