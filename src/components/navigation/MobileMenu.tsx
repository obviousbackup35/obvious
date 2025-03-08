
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
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const prevOpenState = useRef(isOpen);
  
  // Optimize state updates
  useEffect(() => {
    if (prevOpenState.current !== isOpen) {
      if (isOpen) {
        // Opening menu - immediate state change
        setIsAnimatingOut(false);
        setLocalIsOpen(true);
      } else {
        // Closing menu - start exit animation first
        setIsAnimatingOut(true);
        // Delay the actual removal from DOM
        const timer = setTimeout(() => {
          setLocalIsOpen(false);
          setIsAnimatingOut(false);
        }, 500); // Match the CSS transition duration
        return () => clearTimeout(timer);
      }
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
        // Don't call setLocalIsOpen directly, use the closer function
        // that will handle the animation
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

  // Wrapper function to handle view change and close menu with animation
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    // First call the external handler
    handleViewChange(view)(e);
    // Then trigger the animated closing
    closeMobileMenu();
  };

  // Optimize rendering - prevent unnecessary DOM operations when menu is completely closed
  if (!isOpen && !localIsOpen && !isAnimatingOut) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-40 transition-all duration-500 ${
        isAnimatingOut ? 'opacity-0 pointer-events-none' : 
        localIsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(3px)',
        willChange: 'opacity'
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
