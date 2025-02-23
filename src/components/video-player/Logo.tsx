
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
        transitionDelay: style?.opacity === 0 ? '0ms' : '1000ms', // Aplica delay apenas na primeira carga
        ...style,
        // Mantém o delay original apenas para a transição inicial
        transitionProperty: style?.opacity === undefined ? 'opacity' : style.transitionProperty,
        transitionDuration: style?.opacity === undefined ? '2s' : style.transitionDuration,
        transitionTimingFunction: style?.opacity === undefined ? 'ease-in-out' : style.transitionTimingFunction
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
