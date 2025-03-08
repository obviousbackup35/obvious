
import React from 'react';
import type { PolicyView } from '@/types/navigation';

interface PolicyItemProps {
  item: PolicyView;
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  handlePolicyClick: (policy: PolicyView) => void;
}

export const PolicyItem = ({
  item,
  hoveredItem,
  setHoveredItem,
  handlePolicyClick
}: PolicyItemProps) => {
  return (
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
  );
};
