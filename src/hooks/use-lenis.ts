import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop for smooth scrolling
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef.current;
};

// Hook for smooth scroll to element
export const useSmoothScroll = () => {
  const lenis = useLenis();

  const scrollTo = (target: string | Element, options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
  }) => {
    if (!lenis) return;

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    lenis.scrollTo(element, {
      offset: options?.offset || 0,
      duration: options?.duration || 1.2,
      easing: options?.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
    });
  };

  const scrollToTop = (duration?: number) => {
    if (!lenis) return;
    lenis.scrollTo(0, { duration: duration || 1.2 });
  };

  const scrollToBottom = (duration?: number) => {
    if (!lenis) return;
    lenis.scrollTo('max', { duration: duration || 1.2 });
  };

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
    lenis,
  };
};
