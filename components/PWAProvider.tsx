"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Preserves scroll position across re-renders
// Only resets scroll on actual route changes
export function ScrollRestoration() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Only restore on actual route changes
    const key = `scroll-${pathname}`;
    const saved = sessionStorage.getItem(key);
    
    if (saved) {
      // Restore scroll on route change
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }
    
    // Save scroll position before navigation
    const handleBeforeUnload = () => {
      sessionStorage.setItem(key, window.scrollY.toString());
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);
  
  return null;
}

export function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register SW on page load
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW registered:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('SW controller changed - page may need refresh');
      });
    }
  }, []);

  return null;
}