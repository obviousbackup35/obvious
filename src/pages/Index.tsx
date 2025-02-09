
const Index = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 animate-[fade-in_4000ms_ease-in-out_forwards] z-0" 
        style={{ backgroundImage: 'url("/fundo.webp")' }}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-0 z-20"
        style={{ 
          animation: 'fade-in-logo 3000ms ease-in-out forwards',
          animationDelay: '2000ms'
        }}
      >
        <svg 
          width="384" 
          height="auto" 
          viewBox="0 0 384 224" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ maxWidth: '80vw' }}
        >
          <path d="M351.026 223.467H32.9741C14.9741 223.467 0.359863 208.853 0.359863 190.853V32.8533C0.359863 14.8533 14.9741 0.240234 32.9741 0.240234H351.026C369.026 0.240234 383.64 14.8533 383.64 32.8533V190.853C383.64 208.853 369.026 223.467 351.026 223.467Z" fill="white"/>
          <path d="M83.4217 111.853C83.4217 134.586 65.1551 152.853 42.4217 152.853C19.6884 152.853 1.42174 134.586 1.42174 111.853C1.42174 89.1198 19.6884 70.8532 42.4217 70.8532C65.1551 70.8532 83.4217 89.1198 83.4217 111.853Z" fill="#1D1D1B"/>
          <path d="M341.422 111.853C341.422 134.586 323.155 152.853 300.422 152.853C277.688 152.853 259.422 134.586 259.422 111.853C259.422 89.1198 277.688 70.8532 300.422 70.8532C323.155 70.8532 341.422 89.1198 341.422 111.853Z" fill="#1D1D1B"/>
          <path d="M212.422 111.853C212.422 134.586 194.155 152.853 171.422 152.853C148.688 152.853 130.422 134.586 130.422 111.853C130.422 89.1198 148.688 70.8532 171.422 70.8532C194.155 70.8532 212.422 89.1198 212.422 111.853Z" fill="#1D1D1B"/>
        </svg>
      </div>
    </div>
  );
};

export default Index;
