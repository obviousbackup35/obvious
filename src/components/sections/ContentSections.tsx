
import { SectionContent } from "./SectionContent";
import type { ContentView } from "@/types/navigation";
import { PolicyMenu } from "../PolicyMenu";
import { AuthContent } from "../auth/AuthContent";
import { ProfileSection } from "./ProfileSection";
import { useState, useEffect, useCallback, memo, useMemo } from "react";

interface ContentSectionsProps {
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

export const ContentSections = memo(({ currentView, onViewChange }: ContentSectionsProps) => {
  const [lastMainView, setLastMainView] = useState<'video' | 'black' | 'dunes'>('video');
  const isMainView = currentView === 'video' || currentView === 'black' || currentView === 'dunes';

  useEffect(() => {
    if (isMainView) {
      setLastMainView(currentView as 'video' | 'black' | 'dunes');
    }
  }, [currentView, isMainView]);

  const handleBack = useCallback(() => {
    if (!isMainView) {
      onViewChange(lastMainView);
    }
  }, [currentView, lastMainView, onViewChange, isMainView]);

  // Memoize policy sections to avoid recreation on each render
  const policySections = useMemo(() => [
    'privacy', 'terms', 'cookie', 'legal', 'intellectual-property',
    'accessibility', 'refund', 'shipping', 'terms-sale', 'ugc',
    'data-retention', 'cybersecurity', 'ai-policy', 'california-privacy',
    'do-not-sell', 'ethics', 'anti-bribery', 'whistleblower',
    'supplier-code', 'employee-code', 'social-media', 'environmental',
    'sitemap'
  ], []);

  return (
    <div className="absolute inset-0 w-full h-full z-30">
      {/* Black background view */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'black',
          opacity: currentView === 'black' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'black' ? 'auto' : 'none',
          willChange: currentView === 'black' ? 'opacity' : 'auto',
        }}
        aria-hidden={currentView !== 'black'}
      />
      
      {/* Dunes view */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          backgroundPosition: 'center 15%',
          opacity: currentView === 'dunes' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'dunes' ? 'auto' : 'none',
          willChange: currentView === 'dunes' ? 'opacity' : 'auto',
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
      
      {/* Profile section */}
      {currentView === 'profile' && (
        <ProfileSection
          isVisible={true}
          onBack={handleBack}
        />
      )}
      
      {/* Main content sections - only render when active */}
      {currentView === 'company' && (
        <SectionContent
          isVisible={true}
          backgroundImage="/visualelectric-1741372805454.webp"
          title="Company"
          onBack={handleBack}
        />
      )}
      
      {currentView === 'projects' && (
        <SectionContent
          isVisible={true}
          backgroundImage="/visualelectric-1741372813250.webp"
          title="Product"
          onBack={handleBack}
        />
      )}
      
      {currentView === 'gallery' && (
        <SectionContent
          isVisible={true}
          backgroundImage="/visualelectric-1741372954881.webp"
          title="Gallery"
          onBack={handleBack}
        />
      )}
      
      {currentView === 'contact' && (
        <SectionContent
          isVisible={true}
          backgroundImage="/visualelectric-1741373174467.webp"
          title="Contact"
          onBack={handleBack}
        />
      )}

      {/* Auth section */}
      {currentView === 'auth' && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
            opacity: 1,
            transition: 'opacity 1s ease-in-out',
            willChange: 'opacity',
          }}
        >
          <AuthContent onBack={handleBack} />
        </div>
      )}

      {/* Policy Sections - only render when active */}
      {policySections.includes(currentView) && (
        <SectionContent
          key={currentView}
          isVisible={true}
          gradient="linear-gradient(to right, #2c3e50 0%, #3498db 100%)"
          title={currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          onBack={handleBack}
        />
      )}
    </div>
  );
});

ContentSections.displayName = 'ContentSections';
