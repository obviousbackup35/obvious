
import { memo, useEffect, useState } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  
  // Sync localIsOpen with the parent's isOpen state
  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

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

  // Wrapper function to handle view change and close menu
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    // Call the original handler to change the view
    handleViewChange(view)(e);
    // Close the menu with a slight delay to allow for the transition
    setLocalIsOpen(false);
    // The parent component will handle the actual closing
  };

  return (
    <div 
      className={`fixed inset-0 z-40 transition-all duration-300 ${localIsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        willChange: localIsOpen ? 'opacity' : 'auto'
      }}
      aria-hidden={!localIsOpen}
    >
      <div className="flex items-center justify-center h-full">
        <div className="menu-items">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('company')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('projects')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('gallery')}
                className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-xl text-white"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('contact')}
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
