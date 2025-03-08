
import { memo, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  // Add body class to prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-bounce');
    } else {
      document.body.classList.remove('no-bounce');
    }
    
    return () => {
      document.body.classList.remove('no-bounce');
    };
  }, [isOpen]);
  
  // Handle clicks outside the menu
  useEffect(() => {
    if (!isOpen) return;
    
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
  }, [isOpen, closeMobileMenu]);
  
  // Helper function to handle menu item clicks
  const handleMenuItemClick = (view: ContentView) => (e: React.MouseEvent) => {
    handleViewChange(view)(e);
    closeMobileMenu();
  };
  
  // Don't render anything if the menu is closed
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      className={`fixed inset-0 z-40 menu-backdrop ${isOpen ? 'open' : ''}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(3px)',
        willChange: 'opacity'
      }}
      aria-hidden={!isOpen}
    >
      <div className={`flex items-center justify-center h-full menu-content ${isOpen ? 'open' : ''}`}>
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
