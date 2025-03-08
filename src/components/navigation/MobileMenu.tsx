
import { memo } from "react";
import { NavigationButton } from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
}

export const MobileMenu = memo(({ isOpen, handleViewChange }: MobileMenuProps) => {
  return (
    <div 
      className={`fixed top-1/2 left-0 w-full transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        transform: 'translateY(-50%)',
        willChange: isOpen ? 'opacity, transform' : 'auto'
      }}
    >
      <div className="bg-black/70 backdrop-blur-sm rounded-lg mx-4 p-4 text-center">
        <ul className="space-y-4">
          <li>
            <NavigationButton
              onClick={handleViewChange('company')}
              className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
            >
              C O M P A N Y
            </NavigationButton>
          </li>
          <li>
            <NavigationButton
              onClick={handleViewChange('projects')}
              className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
            >
              P R O D U C T
            </NavigationButton>
          </li>
          <li>
            <NavigationButton
              onClick={handleViewChange('gallery')}
              className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
            >
              G A L L E R Y
            </NavigationButton>
          </li>
          <li>
            <NavigationButton
              onClick={handleViewChange('contact')}
              className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 w-full text-sm"
            >
              C O N T A C T
            </NavigationButton>
          </li>
        </ul>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';
