
import { useState, useEffect } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');

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

  return { currentView, setCurrentView };
};
