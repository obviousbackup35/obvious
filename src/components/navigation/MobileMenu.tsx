
import { memo, useEffect, useState, useCallback } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

// Define menu states for better control
type MenuState = 'closed' | 'opening' | 'open' | 'closing';

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const [menuState, setMenuState] = useState<MenuState>(isOpen ? 'open' : 'closed');

  // Use a callback for transitioning between states with proper timing
  const transitionToState = useCallback((newState: MenuState, delay = 0) => {
    if (delay) {
      setTimeout(() => setMenuState(newState), delay);
    } else {
      setMenuState(newState);
    }
    console.log(`MobileMenu: Transitioning to ${newState}${delay ? ` with ${delay}ms delay` : ''}`);
  }, []);

  // Handle incoming prop changes
  useEffect(() => {
    if (isOpen && (menuState === 'closed' || menuState === 'closing')) {
      // Start opening animation
      transitionToState('opening');
      // Complete opening after animation duration
      transitionToState('open', 500);
    } else if (!isOpen && (menuState === 'open' || menuState === 'opening')) {
      // Start closing animation
      transitionToState('closing');
      // Complete closing after animation duration
      transitionToState('closed', 500);
    }
  }, [isOpen, menuState, transitionToState]);

  // Add effect to handle clicks outside the menu
  useEffect(() => {
    // Only add listener when menu is visible in any state
    if (menuState === 'closed') return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      // Allow clicks anywhere on the overlay to close the menu
      // except for clicks on the menu items themselves or the toggle button
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
  }, [menuState, closeMobileMenu]);

  // Wrapper function to handle view change and close menu
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    handleViewChange(view)(e);
    closeMobileMenu();
  };

  // Don't render anything if the menu is fully closed
  if (menuState === 'closed') {
    return null;
  }

  // Map state to CSS classes
  const getStateClasses = () => {
    switch (menuState) {
      case 'opening':
        return 'opacity-0 animate-in fade-in duration-500';
      case 'open':
        return 'opacity-100';
      case 'closing':
        return 'opacity-100 animate-out fade-out duration-500';
      default:
        return 'opacity-0';
    }
  };

  // Fix: Create a boolean variable to properly represent the hidden state
  const isMenuHidden = menuState === 'closing' || menuState === 'closed';

  return (
    <div 
      className={cn(
        "fixed inset-0 z-40 transition-all duration-500 backdrop-blur-[3px]",
        getStateClasses()
      )}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        willChange: 'opacity, backdrop-filter'
      }}
      aria-hidden={isMenuHidden}
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
