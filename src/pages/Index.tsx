
import { useState, useEffect, useCallback } from "react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { VideoOverlay } from "@/components/video-player/VideoOverlay";
import { Logo } from "@/components/video-player/Logo";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { useAudioFade } from "@/hooks/useAudioFade";
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";

type ContentView = 'video' | 'dunes' | 'company' | 'projects' | 'gallery' | 'contact';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { showBlackScreen } = useAudioFade(isPlaying);
  const { 
    audioRef, 
    isMuted, 
    toggleAudio, 
    hasInitialInteraction, 
    setHasInitialInteraction,
    currentTime,
    setCurrentTime
  } = useAudio();
  
  const startPlayback = useCallback(() => {
    const videos = document.querySelectorAll('video');
    if (videos.length && !isPlaying) {
      videos.forEach(video => {
        video.currentTime = currentTime;
        video.play();
      });
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.volume = 1;
      }
      setIsPlaying(true);
    }
  }, [isPlaying, audioRef, currentTime]);

  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!hasInitialInteraction) {
      setHasInitialInteraction(true);
    }
    startPlayback();
  }, [hasInitialInteraction, setHasInitialInteraction, startPlayback]);

  const handleViewChange = (view: ContentView) => {
    setCurrentView(view);
  };

  useEffect(() => {
    if (hasInitialInteraction && !isPlaying) {
      startPlayback();
    }
  }, [hasInitialInteraction, isPlaying, startPlayback]);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const handleVideoTimeUpdate = () => {
      handleTimeUpdate();
      if (video1) {
        setCurrentTime(video1.currentTime);
      }
    };

    video1?.addEventListener('timeupdate', handleVideoTimeUpdate);
    video2?.addEventListener('timeupdate', handleVideoTimeUpdate);

    return () => {
      video1?.removeEventListener('timeupdate', handleVideoTimeUpdate);
      video2?.removeEventListener('timeupdate', handleVideoTimeUpdate);
    };
  }, [isPlaying, handleTimeUpdate, video1Ref, video2Ref, setCurrentTime]);
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden cursor-pointer bg-white"
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <Navigation 
        audioRef={audioRef} 
        isMuted={isMuted} 
        toggleAudio={toggleAudio} 
        isVisible={isPlaying}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      {/* Video Content */}
      <VideoOverlay isBackgroundLoaded={isBackgroundLoaded} />
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: '1s'
        }}
      />
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm"
      />
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
      />
      <Logo isBackgroundLoaded={isBackgroundLoaded} />

      {/* Dunes Content */}
      <div 
        className="absolute inset-0 w-full h-full z-20"
        style={{ 
          backgroundImage: 'url(/dunes.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: showBlackScreen ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
        }}
      />

      {/* Menu Content Sections */}
      <div 
        className="absolute inset-0 w-full h-full z-30"
        style={{ 
          opacity: currentView !== 'video' && currentView !== 'dunes' ? 1 : 0,
          pointerEvents: currentView !== 'video' && currentView !== 'dunes' ? 'auto' : 'none',
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {/* Company Section */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
            opacity: currentView === 'company' ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Company Content
          </div>
        </div>

        {/* Projects Section */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)',
            opacity: currentView === 'projects' ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Projects Content
          </div>
        </div>

        {/* Gallery Section */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)',
            opacity: currentView === 'gallery' ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Gallery Content
          </div>
        </div>

        {/* Contact Section */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to top, #e6b980 0%, #eacda3 100%)',
            opacity: currentView === 'contact' ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Contact Content
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
