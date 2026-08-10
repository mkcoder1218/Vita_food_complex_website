"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a section should run continuous visual work such as marquees,
 * autoplay carousels, or CSS loops.
 *
 * Continuous work is paused when the section is off-screen and briefly while
 * the user is actively scrolling. Entrance animations are handled separately,
 * so pausing these loops does not remove the page's Framer Motion reveals.
 */
export function useViewportActivity<T extends HTMLElement = HTMLElement>(
  rootMargin = "200px 0px",
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!isIntersecting || typeof window === "undefined") {
      scrollingRef.current = false;
      setIsScrolling(false);
      return;
    }

    let settleTimer: number | undefined;

    const handleScroll = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setIsScrolling(true);
      }

      if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer);
      }

      settleTimer = window.setTimeout(() => {
        scrollingRef.current = false;
        setIsScrolling(false);
      }, 140);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer);
      }
      scrollingRef.current = false;
    };
  }, [isIntersecting]);

  return {
    ref,
    isActive: isIntersecting && !isScrolling,
  };
}
