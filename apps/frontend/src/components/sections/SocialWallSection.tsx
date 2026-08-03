'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const COLUMN_1_IMAGES = [
  '/assets/social/social-1.png',
  '/assets/social/social-2.png',
  '/assets/social/social-3.png',
];

const COLUMN_2_IMAGES = [
  '/assets/social/social-4.png',
  '/assets/social/social-5.png',
  '/assets/social/social-1.png',
];

const COLUMN_3_IMAGES = [
  '/assets/social/social-6.png',
  '/assets/social/social-7.png',
  '/assets/social/social-8.png',
];

const COLUMN_4_IMAGES = [
  '/assets/social/social-2.png',
  '/assets/social/social-3.png',
  '/assets/social/social-4.png',
];

const COLUMN_5_IMAGES = [
  '/assets/social/social-5.png',
  '/assets/social/social-6.png',
  '/assets/social/social-7.png',
];

interface ScrollingColumnProps {
  images: string[];
  direction: 'up' | 'down';
  speed?: string;
}

function ScrollingColumn({ images, direction, speed = '25s' }: ScrollingColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const displayImages = [...images, ...images]; // Duplicate for seamless loop

  const handleMouseEnter = () => {
    if (columnRef.current) {
      columnRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (columnRef.current) {
      columnRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <div 
      className="flex-1 overflow-hidden h-full relative min-w-[200px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={columnRef}
        className={`flex flex-col gap-4 md:gap-[16px] will-change-transform ${
          direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'
        }`}
        style={{ animationDuration: speed }}
      >
        {displayImages.map((src, idx) => (
          <div 
            key={idx} 
            className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Social moment ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_IMAGES = [
  '/assets/social/social-1.png', '/assets/social/social-2.png', '/assets/social/social-3.png',
  '/assets/social/social-4.png', '/assets/social/social-5.png', '/assets/social/social-6.png',
  '/assets/social/social-7.png', '/assets/social/social-8.png',
];

export default function SocialWallSection({ content, locale }: { content?: any; locale?: string }) {
  const t = useTranslations("SocialWall");
  const c = content?.[locale as string] || content?.en;
  const images: string[] = (c?.images && c.images.length > 0) ? c.images : DEFAULT_IMAGES;

  return (
    <section className="bg-white py-20 lg:py-32 relative overflow-hidden h-[1080px] flex items-center justify-center">
      
      {/* Background Scrolling Grid Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center opacity-70">
        
        {/* Grid Columns */}
        <div className="flex gap-4 h-[200%] w-[120%] -ml-[10%] transform rotate-[0deg]">
          <ScrollingColumn images={[images[0], images[1], images[2]].filter(Boolean)} direction="up" speed="35s" />
          <ScrollingColumn images={[images[3], images[4], images[0]].filter(Boolean)} direction="down" speed="40s" />
          <ScrollingColumn images={[images[5], images[6], images[7]].filter(Boolean)} direction="up" speed="30s" />
          <ScrollingColumn images={[images[1], images[2], images[3]].filter(Boolean)} direction="down" speed="45s" />
          <ScrollingColumn images={[images[4], images[5], images[6]].filter(Boolean)} direction="up" speed="38s" />
        </div>

        {/* Gradient Overlays to fade top and bottom */}
        <div 
          className="absolute top-0 left-0 right-0 h-[250px] z-10 pointer-events-none"
          style={{ 
            background: 'linear-gradient(to bottom, #FFFFFF 10%, rgba(255,255,255,0.7) 50%, transparent 100%)' 
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-[250px] z-10 pointer-events-none"
          style={{ 
            background: 'linear-gradient(to top, #FFFFFF 10%, rgba(255,255,255,0.7) 50%, transparent 100%)' 
          }}
        />
        {/* Radial gradient to focus center - strong white center glow fade */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(255,255,255,0.98)_20%,rgba(255,255,255,0.7)_60%,transparent_90%)]" />
      </div>

      {/* Center Content with Framer Motion and Big White Center Shadow Fade */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 max-w-[1024px] mx-auto px-6 flex flex-col items-center justify-center text-center gap-8 md:gap-12"
      >
        
        <div className="flex flex-col items-center gap-4">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-['Funnel_Display'] font-medium text-[20px] text-[#404040] leading-tight"
          >
            {c?.label || t("label")}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-['Outfit'] font-black text-[50px] sm:text-[64px] lg:text-[80px] text-[#23B349] leading-[0.9] tracking-[-0.02em]"
          >
            {c?.heading || t("heading")}
          </motion.h2>
        </div>

        {/* Explore Button */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 bg-[#23B349] text-white px-8 py-4 rounded-full font-['Funnel_Display'] font-medium text-[24px] leading-tight hover:bg-[#1a8e38] transition-colors group shadow-lg"
        >
          {c?.cta || t("cta")}
          <span className="font-['Outfit'] text-[20px] group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>

      </motion.div>

    </section>
  );
}
