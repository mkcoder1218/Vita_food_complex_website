'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function MerchandiseSection({ content, locale }: { content?: any; locale?: string }) {
  const t = useTranslations("Merchandise");
  const c = content?.[locale as string] || content?.en;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const MERCH_KEYS = ['necklace', 'cap', 'tshirt', 'sweeter', 'signatureCap', 'badge'] as const;
  const MERCH_IMAGES = [
    '/assets/merchandise/merch-1.png',
    '/assets/merchandise/merch-2.png',
    '/assets/merchandise/merch-3.png',
    '/assets/merchandise/merch-4.png',
    '/assets/merchandise/merch-5.png',
    '/assets/merchandise/merch-red.png',
  ];
  const MERCH_BGS = ['#23B349', '#23B349', '#23B349', '#23B349', '#23B349', '#FF0707'];

  const MERCH_ITEMS = MERCH_KEYS.map((key, i) => {
    const rawItem = c?.items?.[i];

    const cmsTitle = typeof rawItem?.title === 'string' ? rawItem.title : undefined;
    const cmsDesc = typeof rawItem?.desc === 'string' ? rawItem.desc : undefined;

    const fallbackTitle = t.has(`items.${key}.title`) ? t(`items.${key}.title`) : '';
    const fallbackDesc = t.has(`items.${key}.desc`) ? t(`items.${key}.desc`) : '';

    const title = (cmsTitle ?? fallbackTitle).trim();
    const desc = (cmsDesc ?? fallbackDesc).trim();

    return {
      id: i + 1,
      image: typeof rawItem?.image === 'string' && rawItem.image.trim() !== '' ? rawItem.image : MERCH_IMAGES[i],
      title,
      desc,
      hasCaption: Boolean(title || desc),
      bg: MERCH_BGS[i],
      isSpecial: i === 5,
    };
  });

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollableWidth = scrollWidth - clientWidth;
      const progress = scrollableWidth > 0 ? (scrollLeft / scrollableWidth) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="bg-white py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-[128px] flex flex-col items-center">

        <div className="flex flex-col items-center text-center mb-16 lg:mb-20 gap-4">
          <p className="font-['Funnel_Display'] font-medium text-[20px] text-[#404040] leading-tight">
            {c?.label || t("label")}
          </p>
          <h2 className="font-['Outfit'] font-black text-[50px] sm:text-[64px] lg:text-[80px] text-[#23B349] leading-[0.9] tracking-[-0.02em]">
            {c?.heading || t("heading")}
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex items-end gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-12 w-full snap-x snap-mandatory"
        >
          {MERCH_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 relative rounded-[16px] overflow-hidden select-none group snap-center ${
                item.hasCaption
                  ? 'w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] lg:w-[460px] lg:h-[460px]'
                  : 'w-[110px] h-[150px] sm:w-[150px] sm:h-[200px] lg:w-[200px] lg:h-[260px]'
              } ${item.isSpecial ? 'bg-[#FF0707]' : 'bg-[#F3F3F3]'}`}
            >
              <Image
                src={item.image}
                alt={item.title || 'Merchandise item'}
                fill
                loading="lazy"
                decoding="async"
                quality={80}
                sizes={
                  item.hasCaption
                    ? '(max-width: 640px) 220px, (max-width: 1024px) 340px, 460px'
                    : '(max-width: 640px) 110px, (max-width: 1024px) 150px, 200px'
                }
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${item.isSpecial ? 'mix-blend-soft-light' : ''}`}
              />

              {item.hasCaption && (
                item.isSpecial ? (
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 z-10 bg-gradient-to-t from-[#FF0707]/90 to-transparent">
                    <h3 className="font-['Funnel_Display'] font-medium text-[13px] sm:text-[16px] text-[#FFEC19] leading-none mb-2">
                      {item.title}
                    </h3>
                    <p className="font-['Outfit'] font-bold text-[18px] sm:text-[28px] lg:text-[36px] text-white leading-[0.96] tracking-[-0.02em] max-w-[400px]">
                      {item.desc}
                    </p>
                  </div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 lg:p-6" style={{ backgroundColor: item.bg }}>
                    <h3 className="font-['Outfit'] font-bold text-[18px] sm:text-[22px] lg:text-[26px] text-white leading-tight tracking-[-0.02em] mb-1">
                      {item.title}
                    </h3>
                    {item.desc && (
                      <p className="font-['Outfit'] font-medium text-[11px] sm:text-[13px] lg:text-[14px] text-white/90">
                        {item.desc}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center w-full">
          <div className="relative w-full max-w-[1067px] h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#23B349] transition-all duration-100 rounded-full"
              style={{
                width: '30%',
                transform: `translateX(${scrollProgress * 2.33}%)`
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}