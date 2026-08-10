"use client";

import { Link } from "@frontend/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ReactNode } from "react";

const BackgroundDecorations = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-15%] left-[-25%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] md:w-[850px] md:h-[850px] lg:w-[1100px] lg:h-[1100px] bg-[radial-gradient(circle_at_20%_20%,rgba(35,179,73,0.38)_0%,rgba(74,222,128,0.18)_50%,transparent_80%)] blur-[60px] rounded-full" />
    <div className="absolute top-[-5%] right-[-10%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] bg-[radial-gradient(circle_at_70%_30%,rgba(35,179,73,0.15)_0%,transparent_75%)] blur-[50px] rounded-full" />

    <div className="absolute top-[4%] left-[-15%] sm:left-[-12%] md:left-[-10%] lg:left-[-8%] w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] md:w-[340px] md:h-[340px] lg:w-[440px] lg:h-[440px] rotate-[-12deg] blur-[5px] opacity-90 transition-transform duration-300">
      <Image
        src="/assets/hero/round-biscuit.png"
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        decoding="async"
        quality={85}
        sizes="(max-width: 640px) 180px, (max-width: 768px) 260px, (max-width: 1024px) 340px, 440px"
        className="object-contain"
      />
    </div>
  </div>
);

const HeroContent = ({
  t,
  content,
  locale,
}: {
  t: any;
  content?: any;
  locale?: string;
}) => {
  const displayContent = content?.[locale as any] || {
    stylishWayPart1: t("stylishWayPart1"),
    stylishWayPart2: t("stylishWayPart2"),
    description: t("description"),
    cta: t("ourProducts"),
  };

  return (
    <div className="relative pt-28 pb-12 sm:pt-20 md:pt-[140px] lg:pt-[220px] sm:pb-16 md:pb-[40px] lg:pb-[60px] flex flex-col items-center z-10">
      <div className="relative flex flex-col items-center text-center px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#23B349]/20 bg-white/90 px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_2px_8px_rgba(35,179,73,0.08)] backdrop-blur-sm mb-6 sm:mb-8 select-none transition-all hover:border-[#23B349]/40 duration-300">
          <div className="relative w-4 h-4 sm:w-[22px] sm:h-[22px]">
            <Image
              src="/assets/sister/foods.png"
              alt="Belayab Foods Logo"
              fill
              loading="eager"
              decoding="async"
              quality={90}
              sizes="22px"
              className="object-contain"
            />
          </div>
          <span className="font-[family-name:var(--font-outfit)] text-[11px] sm:text-[13px] md:text-sm text-[#404040]/80 tracking-wide font-medium">
            {t.rich("poweredBy", {
              brand: (chunks: ReactNode) => (
                <span className="font-bold text-[#404040]">{chunks}</span>
              ),
            })}
          </span>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-[family-name:var(--font-outfit)] font-extrabold text-[26px] sm:text-[28px] md:text-[42px] lg:text-[56px] text-[#404040] leading-tight tracking-tight">
            {displayContent.stylishWayPart1}
          </h2>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mt-[-4px] sm:mt-[-5px] md:mt-[-10px]">
            <div className="relative w-10 h-10 sm:w-[42px] sm:h-[42px] md:w-[55px] md:h-[55px] lg:w-[75px] lg:h-[75px] rotate-[-12deg] drop-shadow-lg transition-transform hover:scale-110 duration-300">
              <Image
                src="/assets/hero/cookie.png"
                alt="Cookie"
                fill
                loading="eager"
                decoding="async"
                quality={85}
                sizes="(max-width: 640px) 40px, (max-width: 768px) 42px, (max-width: 1024px) 55px, 75px"
                className="object-contain"
              />
            </div>
            <h2 className="font-[family-name:var(--font-outfit)] font-extrabold text-[26px] sm:text-[28px] md:text-[42px] lg:text-[56px] text-[#404040] leading-tight tracking-tight">
              {displayContent.stylishWayPart2}
            </h2>
            <div className="relative w-10 h-10 sm:w-[42px] sm:h-[42px] md:w-[55px] md:h-[55px] lg:w-[75px] lg:h-[75px] rotate-[12deg] drop-shadow-lg transition-transform hover:scale-110 duration-300">
              <Image
                src="/assets/hero/strawberry.png"
                alt="Strawberry"
                fill
                loading="eager"
                decoding="async"
                quality={85}
                sizes="(max-width: 640px) 40px, (max-width: 768px) 42px, (max-width: 1024px) 55px, 75px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-funnel-display)] font-black text-[40px] xs:text-[48px] sm:text-[58px] md:text-[100px] lg:text-[150px] text-[#23B349] leading-[0.92] sm:leading-[0.88] md:leading-[0.85] tracking-[-0.04em] sm:tracking-[-0.05em] mb-8 sm:mb-10 md:mb-12">
          {t("connecting")}
        </h1>

        <p className="hidden sm:block max-w-[620px] font-[family-name:var(--font-outfit)] font-medium text-[15px] sm:text-base md:text-[18px] lg:text-[20px] text-[#404040]/70 leading-relaxed mb-4 px-2 sm:px-4">
          {displayContent.description}
        </p>

        <p className="hidden sm:block font-[family-name:var(--font-outfit)] text-[13px] sm:text-sm text-[#404040]/60 font-medium mb-8 sm:mb-10 tracking-wide px-4">
          {t("relationshipStatement")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-[280px] sm:max-w-none mx-auto mt-6 sm:mt-0">
          <Link
            href="/products"
            className="bg-[#23B349] text-white flex items-center justify-center gap-3 px-6 py-3 sm:px-10 sm:py-4 rounded-full font-[family-name:var(--font-funnel-display)] font-bold text-base sm:text-[18px] md:text-[22px] lg:text-[24px] transition-all hover:scale-105 hover:bg-[#1fa041] active:scale-95 shadow-[0_10px_25px_-5px_rgba(35,179,73,0.35)] min-h-[46px] sm:min-h-[56px] touch-manipulation"
          >
            {displayContent.cta} <span className="text-xl sm:text-2xl">→</span>
          </Link>
          <Link
            href="/about"
            className="border-[2.5px] border-[#23B349] text-[#404040] flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 rounded-full font-[family-name:var(--font-funnel-display)] font-bold text-base sm:text-[18px] md:text-[22px] lg:text-[24px] transition-all hover:bg-[#23B349]/5 active:scale-95 min-h-[46px] sm:min-h-[56px] touch-manipulation"
          >
            {t("whyVita")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection({
  content,
  locale,
}: {
  content?: any;
  locale?: string;
}) {
  const t = useTranslations("Hero");

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-white">
      <BackgroundDecorations />
      <HeroContent t={t} content={content} locale={locale} />
    </section>
  );
}
