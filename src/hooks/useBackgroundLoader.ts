
import { useState, useEffect } from "react";

export const useBackgroundLoader = () => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.loading = "eager"; // Prioritize loading
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  return { isBackgroundLoaded };
};
