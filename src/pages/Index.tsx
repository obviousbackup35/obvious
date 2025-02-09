
const Index = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 animate-[fade-in_4000ms_ease-in-out_forwards] z-0" 
        style={{ backgroundImage: 'url("/fundo.webp")' }}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-0 z-10"
        style={{ 
          animation: 'fade-in-logo 3000ms ease-in-out forwards',
          animationDelay: '2000ms'
        }}
      >
        <img 
          src="/logo.webp" 
          alt="Logo" 
          className="w-96 h-auto object-contain"
          style={{ maxWidth: '80vw' }}
          onError={(e) => {
            console.error('Error loading logo:', e);
            const img = e.target as HTMLImageElement;
            img.style.border = '2px solid red';
          }}
        />
      </div>
    </div>
  );
};

export default Index;
