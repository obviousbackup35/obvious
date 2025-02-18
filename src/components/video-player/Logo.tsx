
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
        transitionProperty: 'opacity',
        transitionDuration: '2s',
        transitionTimingFunction: 'ease-in-out'
      }}
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className="w-[400px] h-auto mt-8"
        style={{ 
          maxWidth: '50vw',
          marginTop: '80px', // Adiciona espaço acima para não conflitar com o menu
          marginBottom: '80px' // Adiciona espaço abaixo para não conflitar com outros elementos
        }}
      />
    </div>
  );
};
