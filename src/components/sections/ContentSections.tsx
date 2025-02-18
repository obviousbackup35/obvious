
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { AuthContent } from "../auth/AuthContent";
import { ProfileSection } from "./ProfileSection";
import { useState, useEffect } from "react";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = ({ currentView, onViewChange }: ContentSectionsProps) => {
  const [lastMainView, setLastMainView] = useState<'video' | 'dunes'>('video');

  useEffect(() => {
    if (currentView === 'video' || currentView === 'dunes') {
      setLastMainView(currentView);
    }
  }, [currentView]);

  const handleBack = () => {
    if (currentView !== 'video' && currentView !== 'dunes') {
      onViewChange(lastMainView);
    }
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
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <img 
            src="/logo menor.webp" 
            alt="Logo" 
            className="w-auto h-16"
          />
        </div>
        <PolicyMenu 
          onViewChange={onViewChange} 
          isVisible={currentView === 'dunes'} 
        />
      </div>
      
      <ProfileSection
        isVisible={currentView === 'profile'}
        onBack={handleBack}
      />
      
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
        gradient="linear-gradient(to right, #e6b980 0%, #eacda3 100%)"
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
