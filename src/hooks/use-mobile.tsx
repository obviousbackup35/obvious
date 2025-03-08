
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create the media query once
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Optimize the change handler
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Set initial value based on media query match
    setIsMobile(mql.matches)
    
    // Use the more efficient event listener
    mql.addEventListener("change", onChange)
    
    // Clean up properly
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile ?? false
}
