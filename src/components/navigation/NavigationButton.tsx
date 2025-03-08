
import { memo } from "react";

interface NavigationButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className: string;
}

const NavigationButton = memo(({ onClick, children, className }: NavigationButtonProps) => (
  <button 
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
));

NavigationButton.displayName = 'NavigationButton';

export default NavigationButton;
