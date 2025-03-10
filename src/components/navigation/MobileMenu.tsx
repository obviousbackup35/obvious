
import { memo, useRef, useMemo, useCallback } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
  getTextColor: () => string;
}

const MobileMenu = memo(({ isOpen, handleViewChange, getTextColor }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  const menuStyles = useMemo(() => ({
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
    transition: 'opacity 600ms ease-in-out, visibility 600ms ease-in-out',
  }), [isOpen]);
  
  const containerStyles = useMemo(() => ({
    transform: isOpen ? 'translate3d(0,0,0)' : 'translate3d(0,-20px,0)',
    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  }), [isOpen]);
  
  const handleCompanyClick = useCallback(handleViewChange('company'), [handleViewChange]);
  const handleProductClick = useCallback(handleViewChange('projects'), [handleViewChange]);
  const handleGalleryClick = useCallback(handleViewChange('gallery'), [handleViewChange]);
  const handleContactClick = useCallback(handleViewChange('contact'), [handleViewChange]);

  const textColor = getTextColor();

  return (
    <div 
      ref={menuRef}
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
      style={menuStyles}
      aria-hidden={!isOpen}
      id="mobile-menu"
    >
      <div 
        className="flex items-center justify-center h-full"
        style={containerStyles}
      >
        <div className="menu-items">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleCompanyClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl"
                style={{ color: textColor }}
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleProductClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl"
                style={{ color: textColor }}
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleGalleryClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl"
                style={{ color: textColor }}
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleContactClick}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl"
                style={{ color: textColor }}
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
