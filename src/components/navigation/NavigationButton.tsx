
import { memo } from "react";

interface NavigationButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
}

const NavigationButton = memo(({ onClick, children, className, style }: NavigationButtonProps) => (
  <button 
    onClick={onClick}
    className={className}
    style={style}
  >
    {children}
  </button>
));

NavigationButton.displayName = 'NavigationButton';

export default NavigationButton;
