
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { useAudioState } from '@/hooks/useAudioState';

const Projects = () => {
  const { audioRef, isMuted, toggleAudio } = useAudioState();

  return (
    <div className="relative h-screen w-full bg-white">
      <Navigation audioRef={audioRef} isMuted={isMuted} toggleAudio={toggleAudio} />
      <audio ref={audioRef} src="/background-music.mp3" loop />
    </div>
  );
};

export default Projects;
