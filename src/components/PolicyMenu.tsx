import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import type { ContentView, PolicyView } from '@/types/navigation';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
  const [activeMobileGroup, setActiveMobileGroup] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isVisible) {
      setActiveMobileGroup(0);
    }
  }, [isVisible]);

  const handlePolicyClick = (policy: PolicyView) => {
    onViewChange(policy);
  };

  const navigateToGroup = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    
    setActiveMobileGroup(prev => {
      if (direction === 'next') {
        return prev < policyGroups.length - 1 ? prev + 1 : prev;
      } else {
        return prev > 0 ? prev - 1 : prev;
      }
    });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || isTransitioning) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateToGroup('next');
      } else {
        navigateToGroup('prev');
      }
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  if (isMobile) {
    return (
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <ChevronUp 
              className={`w-8 h-8 text-white/70 ${activeMobileGroup > 0 ? 'opacity-100' : 'opacity-30'}`} 
              onClick={() => navigateToGroup('prev')}
            />
          </div>
          
          {policyGroups.map((group, index) => (
            <div 
              key={group.title}
              className={`absolute inset-0 flex flex-col items-center justify-center w-full max-w-sm mx-auto transition-all duration-500 ${
                index === activeMobileGroup 
                  ? 'opacity-100' 
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="text-center">
                <h3 className="text-lg font-black mb-6 tracking-wider uppercase" style={{
                  color: '#d4d1b9'
                }}>
                  {group.title}
                </h3>
                <ul className="space-y-4 mb-8">
                  {group.items.map(item => (
                    <li 
                      key={item} 
                      onClick={() => handlePolicyClick(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        cursor-pointer
                        text-sm
                        font-montserrat
                        font-medium
                        transition-opacity
                        duration-300
                        py-1
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
                    <li className="relative mt-8">
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
                
                {index < policyGroups.length - 1 && (
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                    <ChevronDown 
                      className="w-8 h-8 text-white/70" 
                      onClick={() => navigateToGroup('next')}
                    />
                  </div>
                )}
                
                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                  {policyGroups.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeMobileGroup ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto">
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
};
