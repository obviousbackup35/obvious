
import { memo, useEffect, useState, useRef } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle animation state changes when isOpen changes
  useEffect(() => {
    // Clear any existing timeouts to prevent race conditions
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    if (isOpen) {
      // Start opening animation
      setAnimationState('entering');
      // After animation completes, update state
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationState('entered');
      }, 400); // Match the duration of the CSS animation
    } else if (animationState === 'entering' || animationState === 'entered') {
      // Start closing animation
      setAnimationState('exiting');
      // After animation completes, update state
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationState('exited');
      }, 300); // Match the duration of the CSS animation
    }
  }, [isOpen, animationState]);
  
  // Handle clicks outside the menu
  useEffect(() => {
    if (animationState !== 'entered') return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-items') && !target.closest('.mobile-menu-toggle')) {
        closeMobileMenu();
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [animationState, closeMobileMenu]);
  
  // Helper function to handle menu item clicks
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    handleViewChange(view)(e);
    closeMobileMenu();
  };
  
  // Don't render anything if the menu is completely exited
  if (animationState === 'exited') {
    return null;
  }
  
  // Determine CSS classes based on animation state
  const backdropClass = animationState === 'entering' || animationState === 'entered' 
    ? 'menu-backdrop-enter' 
    : 'menu-backdrop-exit';
    
  const contentClass = animationState === 'entering' || animationState === 'entered' 
    ? 'menu-content-enter' 
    : 'menu-content-exit';
  
  return (
    <div 
      className={`fixed inset-0 z-40 ${backdropClass}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(3px)',
        willChange: 'opacity'
      }}
      aria-hidden={animationState === 'exiting' || animationState === 'exited'}
    >
      <div className={`flex items-center justify-center h-full ${contentClass}`}>
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
