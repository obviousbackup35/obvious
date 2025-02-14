
interface LogoProps {
  isBackgroundLoaded: boolean;
}

export const Logo = ({ isBackgroundLoaded }: LogoProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ 
        opacity: isBackgroundLoaded ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        transitionDelay: '1000ms'
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
