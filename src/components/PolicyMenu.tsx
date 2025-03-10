
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Hexagon } from 'lucide-react';

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

// Move policy groups outside component to prevent recreation on every render
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
  const isMobile = useIsMobile();

  // Touch handling optimizations
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  // Optimized touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isSwipe = Math.abs(distance) > minSwipeDistance;
    
    if (isSwipe) {
      if (distance > 0) {
        // Swipe right (go to previous group)
        setCurrentGroupIndex(prev => prev > 0 ? prev - 1 : policyGroups.length - 1);
      } else {
        // Swipe left (go to next group)
        setCurrentGroupIndex(prev => prev < policyGroups.length - 1 ? prev + 1 : 0);
      }
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  }, []);

  // Memoized event handler to prevent recreation on every render
  const handlePolicyClick = useCallback((policy: ContentView) => {
    onViewChange(policy);
  }, [onViewChange]);

  // Memoize current group to prevent unnecessary recalculations
  const currentGroup = useMemo(() => policyGroups[currentGroupIndex], [currentGroupIndex]);

  // Skip rendering when not visible for better performance
  if (!isVisible) {
    return null;
  }

  if (!isMobile) {
    return (
      <div className="absolute inset-0 w-full h-full transition-opacity duration-500 opacity-100">
        <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
            {policyGroups.map(group => (
              <div key={group.title} className="text-center">
                <h3 className="text-sm font-black mb-3 tracking-wider uppercase text-[#555555]">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li
                      key={item}
                      onClick={() => handlePolicyClick(item as ContentView)}
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
                        ${hoveredItem === item ? 'text-white' : 'text-white/80'}
                      `}
                    >
                      {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full transition-opacity duration-500 opacity-100">
      <div 
        className="absolute bottom-64 left-1/2 transform -translate-x-1/2 translate-y-[11.34px] w-full max-w-xs mx-auto px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative flex items-center justify-center">
          <div key={currentGroup.title} className="text-center w-full animate-fade-in">
            <h3 className="text-sm font-black mb-3 tracking-wider uppercase text-[#555555]">
              {currentGroup.title}
            </h3>
            <ul className="space-y-2">
              {currentGroup.items.map(item => (
                <li
                  key={item}
                  onClick={() => handlePolicyClick(item as ContentView)}
                  className="cursor-pointer text-xs font-montserrat font-medium transition-opacity duration-300 py-1 text-white/80 hover:text-white active:text-white mx-[75px]"
                >
                  {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
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
