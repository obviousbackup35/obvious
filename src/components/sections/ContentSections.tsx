
import { SectionContent } from "./SectionContent";

interface ContentSectionsProps {
  currentView: string;
}

export const ContentSections = ({ currentView }: ContentSectionsProps) => {
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
      />
      
      <SectionContent
        isVisible={currentView === 'company'}
        gradient="linear-gradient(to right, #243949 0%, #517fa4 100%)"
        title="Company"
      />
      
      <SectionContent
        isVisible={currentView === 'projects'}
        gradient="linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)"
        title="Projects"
      />
      
      <SectionContent
        isVisible={currentView === 'gallery'}
        gradient="linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)"
        title="Gallery"
      />
      
      <SectionContent
        isVisible={currentView === 'contact'}
        gradient="linear-gradient(to top, #e6b980 0%, #eacda3 100%)"
        title="Contact"
      />
    </div>
  );
};
