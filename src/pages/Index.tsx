
const Index = () => {
  return (
    <div className="relative h-screen w-full">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 animate-[fade-in_4000ms_ease-in-out_forwards]" 
        style={{ backgroundImage: 'url("/fundo.webp")' }}
      />
      <div 
        className="fixed inset-0 flex items-center justify-center opacity-0"
        style={{ 
          animation: 'fade-in-logo 3000ms ease-in-out forwards',
          animationDelay: '2000ms'
        }}
      >
        <img 
          src="/logo.webp" 
          alt="Logo" 
          className="w-64 h-auto"
        />
      </div>
    </div>
  );
};

export default Index;
