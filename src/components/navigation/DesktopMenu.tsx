
import { memo } from "react";
import NavigationButton from "./NavigationButton";
import type { ContentView } from "@/types/navigation";

interface DesktopMenuProps {
  handleViewChange: (view: ContentView) => (e: React.MouseEvent) => void;
}

const DesktopMenu = memo(({ handleViewChange }: DesktopMenuProps) => {
  return (
    <div className="relative w-full max-w-4xl flex justify-center items-center">
      <div className="absolute left-1/4 -translate-x-[calc(100%+2rem)] pointer-events-none">
        <NavigationButton
          onClick={handleViewChange('company')}
          className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto px-0 mx-[130px]"
        >
          C O M P A N Y
        </NavigationButton>
      </div>
      
      <div className="absolute left-1/4 -translate-x-1/2 pointer-events-none">
        <NavigationButton
          onClick={handleViewChange('projects')}
          className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto mx-0 px-0"
        >
          P R O D U C T
        </NavigationButton>
      </div>
      
      <div className="absolute right-1/4 translate-x-1/2 pointer-events-none">
        <NavigationButton
          onClick={handleViewChange('gallery')}
          className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full mx-[5px] pointer-events-auto px-0"
        >
          G A L L E R Y
        </NavigationButton>
      </div>
      
      <div className="absolute right-1/4 translate-x-[calc(100%+2rem)] pointer-events-none">
        <NavigationButton
          onClick={handleViewChange('contact')}
          className="cursor-pointer hover:opacity-70 transition-all duration-700 py-2 rounded-full pointer-events-auto px-0 mx-[133px]"
        >
          C O N T A C T
        </NavigationButton>
      </div>
    </div>
  );
});

DesktopMenu.displayName = 'DesktopMenu';

export default DesktopMenu;
