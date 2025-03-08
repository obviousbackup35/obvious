
import { memo, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  // Add effect to handle clicks outside the menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Don't close if clicking menu items or the menu button (which has its own handler)
      const target = e.target as HTMLElement;
      const isMenuOrButton = target.closest('.mobile-menu-content') || 
                            target.closest('button[aria-label="Menu"]');
      
      if (isOpen && !isMenuOrButton) {
        closeMobileMenu();
      }
    };

    // Add global click listener when menu is open
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeMobileMenu]);

  return (
    <>
      {/* Invisible overlay that covers the whole screen when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          aria-hidden="true"
        />
      )}
      
      <div 
        className={`absolute top-40 left-0 w-full transition-all duration-300 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ 
          willChange: isOpen ? 'opacity, transform' : 'auto'
        }}
      >
        <div className="relative mx-auto">
          {/* Square container to ensure perfect hexagon proportions but larger */}
          <div className="w-[300px] h-[420px] mx-auto">
            {/* Hexagon with perfectly equal sides but stretched vertically */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm clip-hexagon flex items-center justify-center mobile-menu-content">
              <ul className="space-y-4 px-6">
                <li>
                  <NavigationButton
                    onClick={handleViewChange('company')}
                    className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-base text-white"
                  >
                    C O M P A N Y
                  </NavigationButton>
                </li>
                <li>
                  <NavigationButton
                    onClick={handleViewChange('projects')}
                    className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-base text-white"
                  >
                    P R O D U C T
                  </NavigationButton>
                </li>
                <li>
                  <NavigationButton
                    onClick={handleViewChange('gallery')}
                    className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-base text-white"
                  >
                    G A L L E R Y
                  </NavigationButton>
                </li>
                <li>
                  <NavigationButton
                    onClick={handleViewChange('contact')}
                    className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-base text-white"
                  >
                    C O N T A C T
                  </NavigationButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
