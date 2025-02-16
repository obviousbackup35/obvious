
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";

const Projects = () => {
  const { audioRef, isMuted, toggleAudio } = useAudio();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <Navigation 
        audioRef={audioRef} 
        isMuted={isMuted} 
        toggleAudio={toggleAudio}
        isVisible={true}
      />
    </div>
  );
};

export default Projects;
