
import { useEffect } from "react";

export const useScrollBehavior = () => {
  useEffect(() => {
    document.documentElement.classList.add('no-bounce');
    document.body.classList.add('no-bounce');
    
    return () => {
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
    };
  }, []);
};
