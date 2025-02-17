
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { AuthContent } from "../auth/AuthContent";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = ({ currentView, onViewChange }: ContentSectionsProps) => {
  const handleBack = () => {
    onViewChange('dunes');
  };

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
      
      <SectionContent
        isVisible={currentView === 'company'}
        gradient="linear-gradient(to right, #243949 0%, #517fa4 100%)"
        title="Company"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'projects'}
        gradient="linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)"
        title="Projects"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'gallery'}
        gradient="linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)"
        title="Gallery"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'contact'}
        gradient="linear-gradient(to top, #e6b980 0%, #eacda3 100%)"
        title="Contact"
        onBack={handleBack}
      />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
          opacity: currentView === 'auth' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'auth' ? 'auto' : 'none'
        }}
      >
        {currentView === 'auth' && <AuthContent onBack={handleBack} />}
      </div>

      {/* Policy Sections */}
      {[
        'privacy', 'terms', 'cookie', 'legal', 'intellectual-property',
        'accessibility', 'refund', 'shipping', 'terms-sale', 'ugc',
        'data-retention', 'cybersecurity', 'ai-policy', 'california-privacy',
        'do-not-sell', 'ethics', 'anti-bribery', 'whistleblower',
        'supplier-code', 'employee-code', 'social-media', 'environmental',
        'sitemap'
      ].map((policy) => (
        <SectionContent
          key={policy}
          isVisible={currentView === policy}
          gradient="linear-gradient(to right, #2c3e50 0%, #3498db 100%)"
          title={policy.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          onBack={handleBack}
        />
      ))}
    </div>
  );
};
