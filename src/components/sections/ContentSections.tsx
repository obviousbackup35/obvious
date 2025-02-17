
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = ({ currentView, onViewChange }: ContentSectionsProps) => {
  return (
    <div className="absolute inset-0 w-full h-full z-30">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          opacity: currentView === 'dunes' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'dunes' ? 'auto' : 'none'
        }}
      >
        <PolicyMenu 
          onViewChange={onViewChange} 
          isVisible={currentView === 'dunes'} 
        />
      </div>
      
      <div className="relative w-full h-full">
        <SectionContent
          isVisible={currentView === 'company'}
          gradient="linear-gradient(to right, #243949 0%, #517fa4 100%)"
          title="C O M P A N Y"
        />
        
        <SectionContent
          isVisible={currentView === 'projects'}
          gradient="linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)"
          title="P R O J E C T S"
        />
        
        <SectionContent
          isVisible={currentView === 'gallery'}
          gradient="linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)"
          title="G A L L E R Y"
        />
        
        <SectionContent
          isVisible={currentView === 'contact'}
          gradient="linear-gradient(to top, #e6b980 0%, #eacda3 100%)"
          title="C O N T A C T"
        />

        {/* Policy Sections */}
        {[
          ['privacy', 'P R I V A C Y  P O L I C Y'],
          ['terms', 'T E R M S  O F  U S E'],
          ['cookie', 'C O O K I E  P O L I C Y'],
          ['legal', 'L E G A L  D I S C L A I M E R'],
          ['intellectual-property', 'I P  P O L I C Y'],
          ['accessibility', 'A C C E S S I B I L I T Y'],
          ['refund', 'R E F U N D  P O L I C Y'],
          ['shipping', 'S H I P P I N G  P O L I C Y'],
          ['terms-sale', 'T E R M S  O F  S A L E'],
          ['ugc', 'U G C  P O L I C Y'],
          ['data-retention', 'D A T A  R E T E N T I O N'],
          ['cybersecurity', 'C Y B E R S E C U R I T Y'],
          ['ai-policy', 'A I  P O L I C Y'],
          ['california-privacy', 'C A  P R I V A C Y'],
          ['do-not-sell', 'D N S M P I'],
          ['ethics', 'E T H I C S'],
          ['anti-bribery', 'A N T I - B R I B E R Y'],
          ['whistleblower', 'W H I S T L E B L O W E R'],
          ['supplier-code', 'S U P P L I E R  C O D E'],
          ['employee-code', 'E M P L O Y E E  C O D E'],
          ['social-media', 'S O C I A L  M E D I A'],
          ['environmental', 'E N V I R O N M E N T A L'],
          ['sitemap', 'S I T E M A P']
        ].map(([key, title]) => (
          <SectionContent
            key={key}
            isVisible={currentView === key}
            gradient="linear-gradient(to right, #2c3e50 0%, #3498db 100%)"
            title={title}
          />
        ))}
      </div>
    </div>
  );
};
