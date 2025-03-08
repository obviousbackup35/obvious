
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import type { ContentView, PolicyView } from '@/types/navigation';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { Hexagon } from 'lucide-react';

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

const policyGroups = [{
  title: "Legal",
  items: ['privacy', 'terms', 'cookie', 'legal', 'intellectual-property']
}, {
  title: "User Services",
  items: ['accessibility', 'refund', 'shipping', 'terms-sale', 'ugc']
}, {
  title: "Security & Data",
  items: ['data-retention', 'cybersecurity', 'ai-policy', 'california-privacy', 'do-not-sell']
}, {
  title: "Corporate",
  items: ['ethics', 'anti-bribery', 'whistleblower', 'supplier-code', 'employee-code']
}, {
  title: "Other",
  items: ['social-media', 'environmental', 'sitemap']
}] as const;

export const PolicyMenu = ({
  onViewChange,
  isVisible
}: PolicyMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handlePolicyClick = (policy: PolicyView) => {
    onViewChange(policy);
  };

  const currentGroup = policyGroups[currentGroupIndex];

  // Desktop layout with all groups
  if (!isMobile) {
    return (
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
            {policyGroups.map(group => (
              <div key={group.title} className="text-center">
                <h3 className="text-sm font-black mb-3 tracking-wider uppercase" style={{
                  color: '#d4d1b9'
                }}>
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li 
                      key={item} 
                      onClick={() => handlePolicyClick(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        cursor-pointer
                        text-xs
                        font-montserrat
                        font-medium
                        transition-opacity
                        duration-300
                        py-0.5
                        ${hoveredItem === item 
                          ? 'text-white' 
                          : 'text-white/80'
                        }
                      `}
                    >
                      {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </li>
                  ))}
                  {group.title === "Other" && (
                    <li className="relative mt-4">
                      <div className="pt-2">
                        {user ? (
                          <Button 
                            variant="outline" 
                            className="border-0 bg-white/10 hover:bg-white/20 text-white font-montserrat font-medium text-xs px-6 py-2 rounded-full transition-all duration-300" 
                            onClick={() => onViewChange('profile')}
                          >
                            My Profile
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="border-0 bg-white/10 hover:bg-white/20 text-white font-montserrat font-medium text-xs px-6 py-2 rounded-full transition-all duration-300" 
                            onClick={() => onViewChange('auth')}
                          >
                            Login / Register
                          </Button>
                        )}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout with pagination dots as hexagons
  return (
    <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 w-full max-w-xs mx-auto px-4">
        <div className="relative flex items-center justify-center">
          {/* Policy Group */}
          <div 
            key={currentGroup.title} 
            className="text-center w-full animate-fade-in"
          >
            <h3 className="text-sm font-black mb-3 tracking-wider uppercase" style={{
              color: '#d4d1b9'
            }}>
              {currentGroup.title}
            </h3>
            <ul className="space-y-2">
              {currentGroup.items.map(item => (
                <li 
                  key={item} 
                  onClick={() => handlePolicyClick(item)}
                  className="cursor-pointer text-xs font-montserrat font-medium transition-opacity duration-300 py-1 text-white/80 hover:text-white active:text-white"
                >
                  {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </li>
              ))}
              {currentGroup.title === "Other" && (
                <li className="relative mt-4">
                  <div className="pt-2">
                    {user ? (
                      <Button 
                        variant="outline" 
                        className="border-0 bg-white/10 hover:bg-white/20 text-white font-montserrat font-medium text-xs px-6 py-2 rounded-full transition-all duration-300" 
                        onClick={() => onViewChange('profile')}
                      >
                        My Profile
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="border-0 bg-white/10 hover:bg-white/20 text-white font-montserrat font-medium text-xs px-6 py-2 rounded-full transition-all duration-300" 
                        onClick={() => onViewChange('auth')}
                      >
                        Login / Register
                      </Button>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Pagination Hexagons */}
        <div className="flex justify-center mt-6 space-x-3">
          {policyGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGroupIndex(index)}
              className="flex items-center justify-center transition-colors duration-300 hover:opacity-90"
              aria-label={`Go to policy group ${index + 1}`}
            >
              <Hexagon 
                size={18}
                fill={index === currentGroupIndex ? "white" : "transparent"}
                color="white"
                strokeWidth={1.5}
                className="transform rotate-0"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

