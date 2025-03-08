
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { AuthContent } from "../auth/AuthContent";
import { ProfileSection } from "./ProfileSection";
import { useState, useEffect, useCallback, memo } from "react";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = memo(({ currentView, onViewChange }: ContentSectionsProps) => {
  const [lastMainView, setLastMainView] = useState<'video' | 'black' | 'dunes'>('video');

  useEffect(() => {
    if (currentView === 'video' || currentView === 'black' || currentView === 'dunes') {
      setLastMainView(currentView);
    }
  }, [currentView]);

  const handleBack = useCallback(() => {
    if (currentView !== 'video' && currentView !== 'black' && currentView !== 'dunes') {
      onViewChange(lastMainView);
    }
  }, [currentView, lastMainView, onViewChange]);

  // Policy sections defined as a constant to avoid recreating on each render
  const policySections = [
    'privacy', 'terms', 'cookie', 'legal', 'intellectual-property',
    'accessibility', 'refund', 'shipping', 'terms-sale', 'ugc',
    'data-retention', 'cybersecurity', 'ai-policy', 'california-privacy',
    'do-not-sell', 'ethics', 'anti-bribery', 'whistleblower',
    'supplier-code', 'employee-code', 'social-media', 'environmental',
    'sitemap'
  ];

  return (
    <div className="absolute inset-0 w-full h-full z-30">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'black',
          opacity: currentView === 'black' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'black' ? 'auto' : 'none',
          willChange: currentView === 'black' || (lastMainView === 'black' && currentView === 'video') ? 'opacity' : 'auto',
        }}
        aria-hidden={currentView !== 'black'}
      />
      
      <div 
        className="absolute inset-0 w-full h-full bg-cover"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          backgroundPosition: 'center 15%',
          opacity: currentView === 'dunes' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'dunes' ? 'auto' : 'none',
          willChange: currentView === 'dunes' || (lastMainView === 'dunes' && currentView === 'video') ? 'opacity' : 'auto',
        }}
        aria-hidden={currentView !== 'dunes'}
      >
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
        backgroundImage="/visualelectric-1741372805454.webp"
        title="Company"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'projects'}
        backgroundImage="/visualelectric-1741372813250.webp"
        title="Product"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'gallery'}
        backgroundImage="/visualelectric-1741372954881.webp"
        title="Gallery"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'contact'}
        backgroundImage="/visualelectric-1741373174467.webp"
        title="Contact"
        onBack={handleBack}
      />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
          opacity: currentView === 'auth' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'auth' ? 'auto' : 'none',
          willChange: currentView === 'auth' ? 'opacity' : 'auto',
        }}
        aria-hidden={currentView !== 'auth'}
      >
        {currentView === 'auth' && <AuthContent onBack={handleBack} />}
      </div>

      {/* Policy Sections */}
      {policySections.map((policy) => (
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
});

ContentSections.displayName = 'ContentSections';
