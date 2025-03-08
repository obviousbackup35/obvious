
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 100 // ms delay for debouncing resize events

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    // Create the media query once for efficiency
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Set initial value based on media query match
    setIsMobile(mql.matches)
    
    // Use debounced handler for resize events
    let timeoutId: number | undefined
    
    const handleChange = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      
      timeoutId = window.setTimeout(() => {
        setIsMobile(mql.matches)
      }, DEBOUNCE_DELAY)
    }
    
    // Use the more efficient event listener
    mql.addEventListener("change", handleChange)
    
    // Clean up properly
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      mql.removeEventListener("change", handleChange)
    }
  }, [])

  // Memoize the result to prevent unnecessary re-renders
  return React.useMemo(() => isMobile ?? false, [isMobile])
}
