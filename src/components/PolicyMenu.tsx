
import { ChevronRight } from "lucide-react";
import type { ContentView } from "@/types/navigation";

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible?: boolean;
}

export const PolicyMenu = ({ onViewChange, isVisible = true }: PolicyMenuProps) => {
  const handleViewChange = (view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange(view);
  };

  return (
    <div 
      className="absolute bottom-0 w-full z-50 transition-opacity duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <nav className="w-full pb-8">
        <div 
          className="flex justify-center items-center space-x-4 text-[1.38rem] font-montserrat"
          style={{ color: '#c8c5ad' }}
        >
          <button 
            onClick={handleViewChange('privacy')} 
            className="cursor-pointer flex items-center hover:opacity-70 transition-opacity"
          >
            Privacy <ChevronRight className="w-7 h-7" />
          </button>
          
          <button 
            onClick={handleViewChange('terms')} 
            className="cursor-pointer flex items-center hover:opacity-70 transition-opacity"
          >
            Terms <ChevronRight className="w-7 h-7" />
          </button>
          
          <button 
            onClick={handleViewChange('cookie')} 
            className="cursor-pointer flex items-center hover:opacity-70 transition-opacity"
          >
            Cookie <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </nav>
    </div>
  );
};
