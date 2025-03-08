
import { memo, useEffect, useState, useRef } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const prevOpenState = useRef(isOpen);
  
  // Optimize state updates
  useEffect(() => {
    if (prevOpenState.current !== isOpen) {
      setLocalIsOpen(isOpen);
      prevOpenState.current = isOpen;
    }
  }, [isOpen]);

  // Add effect to handle clicks outside the menu - optimized version
  useEffect(() => {
    // Only add listener when menu is open
    if (!isOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      // Allow clicks anywhere on the overlay to close the menu
      // except for clicks on the menu items themselves
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-items') && !target.closest('.mobile-menu-toggle')) {
        closeMobileMenu();
      }
    };

    // Add global click listener with a slight delay to prevent immediate closure
    const timerId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeMobileMenu]);

  // Wrapper function to handle view change and close menu
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    // Perform view change first
    handleViewChange(view)(e);
    // Then close menu
    setLocalIsOpen(false);
  };

  // Optimize rendering - prevent unnecessary DOM operations when menu is closed
  if (!isOpen && !localIsOpen) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-40 transition-all duration-500 ${localIsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('projects')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('gallery')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleMenuItemClick('contact')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
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
