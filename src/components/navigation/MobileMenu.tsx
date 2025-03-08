
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
      // Allow clicks anywhere on the overlay to close the menu
      // except for clicks on the menu items themselves
      const target = e.target as HTMLElement;
      if (target.closest('.menu-items')) {
        // Don't close if clicking on menu items
        return;
      }
      
      closeMobileMenu();
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
    <div 
      className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        willChange: isOpen ? 'opacity' : 'auto'
      }}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-center h-full">
        <div className="menu-items">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleViewChange('company')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('projects')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('gallery')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('contact')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
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
