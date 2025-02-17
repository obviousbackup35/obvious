
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = ({ currentView, onViewChange }: ContentSectionsProps) => {
  return (
    <div className="fixed inset-0 w-full h-full z-30">
      {/* Background Layer */}
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
      
      {/* Content Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-8">
            {/* Main Sections */}
            {[
              ['company', 'C O M P A N Y', 'linear-gradient(to right, #243949 0%, #517fa4 100%)'],
              ['projects', 'P R O J E C T S', 'linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)'],
              ['gallery', 'G A L L E R Y', 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)'],
              ['contact', 'C O N T A C T', 'linear-gradient(to top, #e6b980 0%, #eacda3 100%)'],
              // Policy Sections
              ['privacy', 'P R I V A C Y  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['terms', 'T E R M S  O F  U S E', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['cookie', 'C O O K I E  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['legal', 'L E G A L  D I S C L A I M E R', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['intellectual-property', 'I P  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['accessibility', 'A C C E S S I B I L I T Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['refund', 'R E F U N D  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['shipping', 'S H I P P I N G  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['terms-sale', 'T E R M S  O F  S A L E', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['ugc', 'U G C  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['data-retention', 'D A T A  R E T E N T I O N', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['cybersecurity', 'C Y B E R S E C U R I T Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['ai-policy', 'A I  P O L I C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['california-privacy', 'C A  P R I V A C Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['do-not-sell', 'D N S M P I', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['ethics', 'E T H I C S', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['anti-bribery', 'A N T I - B R I B E R Y', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['whistleblower', 'W H I S T L E B L O W E R', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['supplier-code', 'S U P P L I E R  C O D E', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['employee-code', 'E M P L O Y E E  C O D E', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['social-media', 'S O C I A L  M E D I A', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['environmental', 'E N V I R O N M E N T A L', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)'],
              ['sitemap', 'S I T E M A P', 'linear-gradient(to right, #2c3e50 0%, #3498db 100%)']
            ].map(([key, title, gradient]) => (
              <SectionContent
                key={key}
                isVisible={currentView === key}
                gradient={gradient as string}
                title={title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
