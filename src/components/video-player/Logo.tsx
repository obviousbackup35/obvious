
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
        // Durante a primeira carga (quando style?.transition é undefined), usa transição lenta
        // Nas transições entre páginas, usa exatamente o mesmo timing do vídeo
        transition: style?.transition || 'opacity 2s ease-in-out',
        transitionDelay: style?.transition ? '0ms' : '1000ms', // Remove o delay nas transições entre páginas
        visibility: isBackgroundLoaded ? 'visible' : 'hidden', // Garante que o logo só apareça após o fundo carregar
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
