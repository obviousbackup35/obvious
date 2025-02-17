
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import type { ContentView, PolicyView } from '@/types/navigation';
import { useAuth } from './AuthProvider';

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

const policyGroups = [
  {
    title: "Legal",
    items: ['privacy', 'terms', 'cookie', 'legal', 'intellectual-property']
  },
  {
    title: "User Services",
    items: ['accessibility', 'refund', 'shipping', 'terms-sale', 'ugc']
  },
  {
    title: "Security & Data",
    items: ['data-retention', 'cybersecurity', 'ai-policy', 'california-privacy', 'do-not-sell']
  },
  {
    title: "Corporate",
    items: ['ethics', 'anti-bribery', 'whistleblower', 'supplier-code', 'employee-code']
  },
  {
    title: "Other",
    items: ['social-media', 'environmental', 'sitemap']
  }
] as const;

export const PolicyMenu = ({ onViewChange, isVisible }: PolicyMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePolicyClick = (policy: PolicyView) => {
    onViewChange(policy);
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute top-[64%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {policyGroups.map((group) => (
            <div
              key={group.title}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold mb-6" style={{ color: '#c8c5ad' }}>{group.title}</h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li
                    key={item}
                    onClick={() => handlePolicyClick(item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-pointer transition-colors duration-300 text-lg font-semibold text-white/90 hover:text-white/70 text-center"
                  >
                    {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </li>
                ))}
                {group.title === "Other" && (
                  <li className="relative mt-[20vh]">
                    {user ? (
                      <Button 
                        variant="outline" 
                        className="border-0 mix-blend-color-burn font-semibold bg-[#c8c5ad] hover:bg-[#c8c5ad]/90 clip-hexagon px-8"
                        onClick={() => onViewChange('profile')}
                      >
                        My Profile
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="border-0 mix-blend-color-burn font-semibold bg-[#c8c5ad] hover:bg-[#c8c5ad]/90 clip-hexagon px-8"
                        onClick={() => onViewChange('auth')}
                      >
                        Login / Register
                      </Button>
                    )}
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
