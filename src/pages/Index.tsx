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
  const { audioRef, audioVolume } = useAudioFade(isPlaying);
  const { 
    isMuted, 
    toggleAudio, 
    hasInitialInteraction, 
    setHasInitialInteraction,
    currentTime,
    setCurrentTime
  } = useAudio();

  useEffect(() => {
    if (!isPlaying) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (event.deltaY > 0 && currentView === 'video') {
        setCurrentView('dunes');
      } else if (event.deltaY < 0 && currentView === 'dunes') {
        setCurrentView('video');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isPlaying, currentView]);

  const startPlayback = useCallback(async () => {
    try {
      const videos = document.querySelectorAll('video');
      if (videos.length && !isPlaying) {
        const playPromises = Array.from(videos).map(video => {
          video.currentTime = currentTime;
          return video.play();
        });

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          const audioPromise = audioRef.current.play();
          playPromises.push(audioPromise);
        }

        await Promise.all(playPromises);
        if (audioRef.current) {
          audioRef.current.volume = 1;
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error starting playback:', error);
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

      <div 
        className="absolute inset-0 w-full h-full z-10"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      />

      <VideoOverlay 
        isBackgroundLoaded={isBackgroundLoaded} 
        style={{ 
          opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
          transition: 'opacity 2s ease-in-out',
        }}
      />
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm"
        style={{
          opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20
        }}
      />
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
        style={{
          opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20
        }}
      />
      <Logo 
        isBackgroundLoaded={isBackgroundLoaded}
        style={{
          opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 30
        }}
      />

      <div className="absolute inset-0 w-full h-full z-30">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("/dunes.webp")',
            opacity: currentView === 'dunes' ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            pointerEvents: currentView === 'dunes' ? 'auto' : 'none'
          }}
        />

        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
            opacity: currentView === 'company' ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            pointerEvents: currentView === 'company' ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Company Content
          </div>
        </div>

        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)',
            opacity: currentView === 'projects' ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            pointerEvents: currentView === 'projects' ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Projects Content
          </div>
        </div>

        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)',
            opacity: currentView === 'gallery' ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            pointerEvents: currentView === 'gallery' ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
            Gallery Content
          </div>
        </div>

        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(to top, #e6b980 0%, #eacda3 100%)',
            opacity: currentView === 'contact' ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            pointerEvents: currentView === 'contact' ? 'auto' : 'none'
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
