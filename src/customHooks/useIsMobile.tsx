import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= breakpoint);

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleResize = (e: MediaQueryListEvent): void => setIsMobile(e.matches);

    // Initial check
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
