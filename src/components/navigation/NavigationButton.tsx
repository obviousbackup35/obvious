
import { memo } from "react";

interface NavigationButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className: string;
  ariaLabel?: string;
}

export const NavigationButton = memo(({ onClick, children, className, ariaLabel }: NavigationButtonProps) => (
  <button 
    onClick={onClick}
    className={className}
    aria-label={ariaLabel}
  >
    {children}
  </button>
));

NavigationButton.displayName = 'NavigationButton';
