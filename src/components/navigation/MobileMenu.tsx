
import { memo, useRef, useCallback } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Use optimized callbacks for event handlers
  const handleCompanyClick = useCallback(handleViewChange('company'), [handleViewChange]);
  const handleProductClick = useCallback(handleViewChange('projects'), [handleViewChange]);
  const handleGalleryClick = useCallback(handleViewChange('gallery'), [handleViewChange]);
  const handleContactClick = useCallback(handleViewChange('contact'), [handleViewChange]);

  // Direct handler for clicking the backdrop
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop (not on child elements)
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  }, [closeMobileMenu]);

  // Prevent menu content clicks from propagating to the backdrop
  const handleMenuContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return (
    // Base layer - the full screen backdrop that closes the menu when clicked
    <div 
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
      id="mobile-menu"
      data-testid="mobile-menu-backdrop"
    >
      {/* Menu content - stops propagation to prevent backdrop clicks */}
      <div 
        ref={menuRef}
        className="relative z-50 bg-black/80 rounded-lg p-4 transform transition-all duration-300 ease-out"
        onClick={handleMenuContentClick}
        style={{
          maxWidth: "90%",
          width: "300px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
        }}
      >
        <div className="menu-items">
          <ul className="space-y-6 p-4 text-center">
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
