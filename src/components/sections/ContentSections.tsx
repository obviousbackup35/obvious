
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { useState, useEffect, useCallback, memo } from "react";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = memo(({ currentView, onViewChange }: ContentSectionsProps) => {
  const [lastMainView, setLastMainView] = useState<'video' | 'black' | 'dunes'>('video');

  // Debug render
  useEffect(() => {
    console.log(`ContentSections rendering with currentView: ${currentView}`);
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'video' || currentView === 'black' || currentView === 'dunes') {
      setLastMainView(currentView);
      console.log(`Setting lastMainView to: ${currentView}`);
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
          zIndex: 10,
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
          willChange: currentView === 'dunes' || (lastMainView === 'dunes' && currentView === 'black') ? 'opacity' : 'auto',
          zIndex: 20, // Garantindo que as dunas fiquem acima do fundo preto
        }}
        aria-hidden={currentView !== 'dunes'}
      >
        {currentView === 'dunes' && (
          <PolicyMenu 
            onViewChange={onViewChange} 
            isVisible={true} 
          />
        )}
      </div>
      
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
