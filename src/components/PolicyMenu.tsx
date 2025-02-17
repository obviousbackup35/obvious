
import { useCallback } from "react";
import type { ContentView } from "@/types/navigation";

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible?: boolean;
}

export const PolicyMenu = ({ onViewChange, isVisible = true }: PolicyMenuProps) => {
  const handleViewChange = useCallback((view: ContentView) => (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange(view);
  }, [onViewChange]);

  return (
    <div 
      className="absolute bottom-8 w-full z-50 transition-opacity duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <nav className="w-full px-8">
        <div className="grid grid-cols-4 gap-x-16 gap-y-4 justify-items-start font-montserrat text-[#a4a4a3] text-sm font-semibold">
          <button onClick={handleViewChange('privacy')} className="cursor-pointer hover:opacity-70 transition-opacity">
            P R I V A C Y&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('terms')} className="cursor-pointer hover:opacity-70 transition-opacity">
            T E R M S&nbsp;&nbsp;O F&nbsp;&nbsp;U S E
          </button>
          <button onClick={handleViewChange('cookie')} className="cursor-pointer hover:opacity-70 transition-opacity">
            C O O K I E&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('legal')} className="cursor-pointer hover:opacity-70 transition-opacity">
            L E G A L&nbsp;&nbsp;D I S C L A I M E R
          </button>
          <button onClick={handleViewChange('intellectual-property')} className="cursor-pointer hover:opacity-70 transition-opacity">
            I P&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('accessibility')} className="cursor-pointer hover:opacity-70 transition-opacity">
            A C C E S S I B I L I T Y
          </button>
          <button onClick={handleViewChange('refund')} className="cursor-pointer hover:opacity-70 transition-opacity">
            R E F U N D&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('shipping')} className="cursor-pointer hover:opacity-70 transition-opacity">
            S H I P P I N G&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('terms-sale')} className="cursor-pointer hover:opacity-70 transition-opacity">
            T E R M S&nbsp;&nbsp;O F&nbsp;&nbsp;S A L E
          </button>
          <button onClick={handleViewChange('ugc')} className="cursor-pointer hover:opacity-70 transition-opacity">
            U G C&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('data-retention')} className="cursor-pointer hover:opacity-70 transition-opacity">
            D A T A&nbsp;&nbsp;R E T E N T I O N
          </button>
          <button onClick={handleViewChange('cybersecurity')} className="cursor-pointer hover:opacity-70 transition-opacity">
            C Y B E R S E C U R I T Y
          </button>
          <button onClick={handleViewChange('ai-policy')} className="cursor-pointer hover:opacity-70 transition-opacity">
            A I&nbsp;&nbsp;P O L I C Y
          </button>
          <button onClick={handleViewChange('california-privacy')} className="cursor-pointer hover:opacity-70 transition-opacity">
            C A&nbsp;&nbsp;P R I V A C Y
          </button>
          <button onClick={handleViewChange('do-not-sell')} className="cursor-pointer hover:opacity-70 transition-opacity">
            D N S M P I
          </button>
          <button onClick={handleViewChange('ethics')} className="cursor-pointer hover:opacity-70 transition-opacity">
            E T H I C S
          </button>
          <button onClick={handleViewChange('anti-bribery')} className="cursor-pointer hover:opacity-70 transition-opacity">
            A N T I - B R I B E R Y
          </button>
          <button onClick={handleViewChange('whistleblower')} className="cursor-pointer hover:opacity-70 transition-opacity">
            W H I S T L E B L O W E R
          </button>
          <button onClick={handleViewChange('supplier-code')} className="cursor-pointer hover:opacity-70 transition-opacity">
            S U P P L I E R&nbsp;&nbsp;C O D E
          </button>
          <button onClick={handleViewChange('employee-code')} className="cursor-pointer hover:opacity-70 transition-opacity">
            E M P L O Y E E&nbsp;&nbsp;C O D E
          </button>
          <button onClick={handleViewChange('social-media')} className="cursor-pointer hover:opacity-70 transition-opacity">
            S O C I A L&nbsp;&nbsp;M E D I A
          </button>
          <button onClick={handleViewChange('environmental')} className="cursor-pointer hover:opacity-70 transition-opacity">
            E N V I R O N M E N T A L
          </button>
          <button onClick={handleViewChange('sitemap')} className="cursor-pointer hover:opacity-70 transition-opacity">
            S I T E M A P
          </button>
        </div>
      </nav>
    </div>
  );
};
