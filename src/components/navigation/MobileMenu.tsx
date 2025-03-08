
import { memo, useRef } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
  closeMobileMenu: () => void;
}

const MobileMenu = memo(({ isOpen, handleViewChange, closeMobileMenu }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={menuRef}
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
      style={{ 
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'opacity 600ms ease-in-out, visibility 600ms ease-in-out',
        willChange: 'opacity, visibility'
      }}
      aria-hidden={!isOpen}
    >
      <div 
        className="flex items-center justify-center h-full"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform'
        }}
      >
        <div className="menu-items">
          <ul className="space-y-6 p-8 text-center">
            <li>
              <NavigationButton
                onClick={handleViewChange('company')}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                C O M P A N Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('projects')}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                P R O D U C T
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('gallery')}
                className="cursor-pointer hover:opacity-70 transition-all duration-500 py-2 w-full text-xl text-[#c8c5ad]"
              >
                G A L L E R Y
              </NavigationButton>
            </li>
            <li>
              <NavigationButton
                onClick={handleViewChange('contact')}
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
