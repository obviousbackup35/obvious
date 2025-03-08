
import React from 'react';
import { PolicyGroup } from './PolicyGroup';
import type { ContentView } from '@/types/navigation';

interface MobilePolicyMenuProps {
  policyGroups: readonly {
    title: string;
    items: readonly any[];
  }[];
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

export const MobilePolicyMenu = ({
  policyGroups,
  hoveredItem,
  setHoveredItem,
  onViewChange,
  isVisible
}: MobilePolicyMenuProps) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 overflow-y-auto">
        {policyGroups.map((group, index) => (
          <PolicyGroup
            key={group.title}
            title={group.title}
            items={group.items}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            onViewChange={onViewChange}
            isLastGroup={index === policyGroups.length - 1}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );
};
