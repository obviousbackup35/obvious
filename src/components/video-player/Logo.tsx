
import { CSSProperties } from "react";

interface LogoProps {
  isBackgroundLoaded: boolean;
  style?: CSSProperties;
}

export const Logo = ({ isBackgroundLoaded, style }: LogoProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ 
        opacity: isBackgroundLoaded ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        transitionDelay: '1000ms',
        ...style,
        // Mantém o delay original para a transição inicial
        transitionProperty: 'opacity',
        transitionDuration: '2s',
        transitionTimingFunction: 'ease-in-out'
      }}
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className="w-[660px] h-auto"
        style={{ maxWidth: '80vw' }}
      />
    </div>
  );
};
