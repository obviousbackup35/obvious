
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { useState, useEffect, useCallback, memo } from "react";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = memo(({ currentView, onViewChange }: ContentSectionsProps) => {
  const [lastMainView, setLastMainView] = useState<'video'>('video');

  // Debug rendering
  useEffect(() => {
    console.log(`ContentSections rendering with currentView: ${currentView}`);
  }, [currentView]);

  // Track main view changes
  useEffect(() => {
    if (currentView === 'video') {
      setLastMainView(currentView);
      console.log(`Setting lastMainView to: ${currentView}`);
    }
  }, [currentView]);

  const handleBack = useCallback(() => {
    if (currentView !== 'video') {
      onViewChange(lastMainView);
    }
  }, [currentView, lastMainView, onViewChange]);

  // Policy sections constant to avoid recreation on each render
  const policySections = [
    'privacy', 'terms', 'cookie', 'legal', 'intellectual-property',
    'accessibility', 'refund', 'shipping', 'terms-sale', 'ugc',
    'data-retention', 'cybersecurity', 'ai-policy', 'california-privacy',
    'do-not-sell', 'ethics', 'anti-bribery', 'whistleblower',
    'supplier-code', 'employee-code', 'social-media', 'environmental',
    'sitemap'
  ];

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Video layer - lowest z-index */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'transparent',
          zIndex: 10
        }}
        aria-hidden="true"
      />
      
      {/* Content for other sections with higher z-index */}
      <div className="z-40">
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

        {/* Policy sections */}
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
    </div>
  );
});

ContentSections.displayName = 'ContentSections';
