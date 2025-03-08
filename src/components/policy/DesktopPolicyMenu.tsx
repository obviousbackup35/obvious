
import React from 'react';
import { PolicyGroup } from './PolicyGroup';
import type { ContentView } from '@/types/navigation';

interface DesktopPolicyMenuProps {
  policyGroups: readonly {
    title: string;
    items: readonly any[];
  }[];
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

export const DesktopPolicyMenu = ({
  policyGroups,
  hoveredItem,
  setHoveredItem,
  onViewChange,
  isVisible
}: DesktopPolicyMenuProps) => {
  return (
    <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {policyGroups.map((group, index) => (
            <PolicyGroup
              key={group.title}
              title={group.title}
              items={group.items}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              onViewChange={onViewChange}
              isLastGroup={index === policyGroups.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
