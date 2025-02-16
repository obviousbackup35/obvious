
import { Navigation } from "@/components/Navigation";
import { useAudioState } from "@/hooks/useAudioState";

const Company = () => {
  const { audioRef, isMuted, toggleAudio } = useAudioState();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <Navigation audioRef={audioRef} isMuted={isMuted} toggleAudio={toggleAudio} />
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
      />
    </div>
  );
};

export default Company;
