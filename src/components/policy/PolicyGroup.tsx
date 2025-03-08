
import React from 'react';
import { PolicyItem } from './PolicyItem';
import type { PolicyView, ContentView } from '@/types/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '../AuthProvider';

interface PolicyGroupProps {
  title: string;
  items: readonly PolicyView[];
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  onViewChange: (view: ContentView) => void;
  isLastGroup?: boolean;
  isMobile?: boolean;
}

export const PolicyGroup = ({
  title,
  items,
  hoveredItem,
  setHoveredItem,
  onViewChange,
  isLastGroup = false,
  isMobile = false
}: PolicyGroupProps) => {
  const { user } = useAuth();
  
  const handlePolicyClick = (policy: PolicyView) => {
    onViewChange(policy);
  };

  return (
    <div className={isMobile ? "mb-8" : "text-center"}>
      <h3 
        className={`font-black tracking-wider uppercase ${isMobile ? "text-lg mb-6" : "text-sm mb-3"}`} 
        style={{ color: '#d4d1b9' }}
      >
        {title}
      </h3>
      <ul className={`${isMobile ? "space-y-4 mb-8" : "space-y-2"}`}>
        {items.map(item => (
          <PolicyItem
            key={item}
            item={item}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            handlePolicyClick={handlePolicyClick}
          />
        ))}
        {isLastGroup && (
          <li className={`relative ${isMobile ? "mt-8" : "mt-4"}`}>
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
  );
};
