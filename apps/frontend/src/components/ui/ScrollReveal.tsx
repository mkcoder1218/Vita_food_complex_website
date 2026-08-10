"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  className?: string;
  /**
   * Set to true only for sections that should reveal a single time.
   * The default is false so Vita's section reveal animation plays again when
   * the user scrolls away and then returns from either direction.
   */
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 30,
  xOffset = 0,
  className = "",
  once = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, y: yOffset, x: xOffset }
      }
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{
        once,
        amount: 0.12,
        margin: "0px 0px -8% 0px",
      }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        ease: [0.25, 1, 0.5, 1],
        delay: reduceMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
