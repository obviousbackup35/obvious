
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
  const [lastMainView, setLastMainView] = useState<'video' | 'black' | 'dunes'>('video');

  useEffect(() => {
    if (currentView === 'video' || currentView === 'black' || currentView === 'dunes') {
      setLastMainView(currentView);
    }
  }, [currentView]);

  const handleBack = () => {
    if (currentView !== 'video' && currentView !== 'black' && currentView !== 'dunes') {
      onViewChange(lastMainView);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full z-30">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'black',
          opacity: currentView === 'black' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'black' ? 'auto' : 'none'
        }}
      />
      
      <div 
        className="absolute inset-0 w-full h-full bg-cover"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          backgroundPosition: 'center 15%',
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
      
      <ProfileSection
        isVisible={currentView === 'profile'}
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'company'}
        backgroundImage="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1920&q=80"
        title="Company"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'projects'}
        backgroundImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
        title="Product"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'gallery'}
        backgroundImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
        title="Gallery"
        onBack={handleBack}
      />
      
      <SectionContent
        isVisible={currentView === 'contact'}
        backgroundImage="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1920&q=80"
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
