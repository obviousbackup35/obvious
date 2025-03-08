
import { memo, useEffect, useRef } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div 
      ref={menuRef}
      className="fixed inset-0 z-40 transition-opacity duration-300"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(3px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        willChange: 'opacity, transform'
      }}
      aria-hidden={!isOpen}
    >
      <div 
        className="flex items-center justify-center h-full"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'transform 300ms ease-out',
          willChange: 'transform'
        }}
      >
        <div className="menu-items">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleViewChange('company')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('projects')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('gallery')}
                className="cursor-pointer hover:opacity-70 transition-all duration-300 py-2 w-full text-xl text-[#c8c5ad]"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('contact')}
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
