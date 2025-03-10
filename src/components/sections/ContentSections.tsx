
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

  // Depuração de renderização
  useEffect(() => {
    console.log(`ContentSections rendering with currentView: ${currentView}`);
  }, [currentView]);

  // Rastrear mudanças na visualização principal
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

  // Seções de política definidas como constante para evitar recriação em cada renderização
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
      {/* Camada de vídeo - z-index mais baixo */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'transparent',
          zIndex: 10
        }}
        aria-hidden="true"
      />
      
      {/* Camada de fundo preto - z-index médio */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'black',
          opacity: currentView === 'black' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'black' ? 'auto' : 'none',
          zIndex: 20,
        }}
        aria-hidden={currentView !== 'black'}
      />
      
      {/* Camada de dunas - z-index mais alto para os principais níveis */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover"
        style={{ 
          backgroundImage: 'url("/dunes.webp")',
          backgroundPosition: 'center 15%',
          opacity: currentView === 'dunes' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: currentView === 'dunes' ? 'auto' : 'none',
          zIndex: 30,
        }}
        aria-hidden={currentView !== 'dunes'}
      >
        {/* Sempre renderiza PolicyMenu mas controla visibilidade */}
        <PolicyMenu 
          onViewChange={onViewChange} 
          isVisible={currentView === 'dunes'} 
        />
      </div>
      
      {/* Conteúdo de outras seções com z-index mais alto */}
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

        {/* Seções de política */}
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
