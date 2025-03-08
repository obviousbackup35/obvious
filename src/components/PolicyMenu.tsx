
import { useState } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobilePolicyMenu } from './policy/MobilePolicyMenu';
import { DesktopPolicyMenu } from './policy/DesktopPolicyMenu';
import { policyGroups } from './policy/policyGroups';

interface PolicyMenuProps {
  onViewChange: (view: ContentView) => void;
  isVisible: boolean;
}

export const PolicyMenu = ({
  onViewChange,
  isVisible
}: PolicyMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobilePolicyMenu
      policyGroups={policyGroups}
      hoveredItem={hoveredItem}
      setHoveredItem={setHoveredItem}
      onViewChange={onViewChange}
      isVisible={isVisible}
    />
  ) : (
    <DesktopPolicyMenu
      policyGroups={policyGroups}
      hoveredItem={hoveredItem}
      setHoveredItem={setHoveredItem}
      onViewChange={onViewChange}
      isVisible={isVisible}
    />
  );
};
