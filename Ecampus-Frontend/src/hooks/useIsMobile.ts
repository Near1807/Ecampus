import { useEffect, useState } from 'react'

/** true quand la fenêtre fait au plus `breakpoint` px de large. */
export function useIsMobile(breakpoint = 640): boolean {
  const [mobile, setMobile] = useState(() => window.innerWidth <= breakpoint)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return mobile
}
