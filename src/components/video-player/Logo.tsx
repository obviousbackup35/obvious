
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
        ...style,
        // Usa transição lenta apenas na primeira carga (quando style está undefined)
        // Nas transições entre páginas, usa o timing passado via style prop
        transition: style?.transition || 'opacity 2s ease-in-out',
        transitionDelay: style?.transitionDelay || '1000ms',
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
