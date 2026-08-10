"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { useViewportActivity } from "@/hooks/useViewportActivity";

const clients = [1, 2, 3];
const marqueeItems = Array.from({ length: 8 });

function ClientAvatars() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex -space-x-3 sm:-space-x-4">
        {clients.map((client) => (
          <div
            key={client}
            className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 overflow-hidden rounded-full border-2 border-white shadow-md bg-white/10"
          >
            <Image
              src={`/assets/hero/client-${client}.png`}
              alt={`Client ${client}`}
              fill
              loading="eager"
              decoding="async"
              quality={80}
              sizes="(max-width: 640px) 36px, (max-width: 768px) 40px, 48px"
              className="object-cover"
            />
          </div>
        ))}
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-white bg-neutral-400 text-[10px] font-bold text-white shadow-md md:text-sm">
          +3
        </div>
      </div>
    </div>
  );
}

function MarqueeBanner({
  t,
  isActive,
}: {
  t: ReturnType<typeof useTranslations>;
  isActive: boolean;
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-12 w-[220vw] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] bg-[#FFEC19] border-b-[5px] border-[#404040] shadow-2xl sm:h-14 sm:border-b-[6px] md:h-20 md:border-b-[8px] lg:h-28 lg:border-b-[12px]">
      <div className="relative flex h-full items-center overflow-hidden whitespace-nowrap">
        <div
          className="animate-marquee flex whitespace-nowrap"
          style={{
            animationPlayState: isActive ? "running" : "paused",
            willChange: isActive ? "transform" : "auto",
          }}
        >
          {marqueeItems.map((_, index) => (
            <span
              key={index}
              className="mx-6 sm:mx-8 md:mx-10 font-['Funnel_Display'] text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-extrabold italic tracking-tighter text-[#DB4426]"
            >
              A new stylish way of {t("connecting")}!
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroVideoSection({
  content,
  locale,
}: {
  content?: any;
  locale?: string;
}) {
  const t = useTranslations("Hero");
  const c = content?.[locale as string] || content?.en;
  const secondaryQuote = c?.secondaryQuote || t("secondaryQuote");
  const ourClients = c?.ourClients || t("ourClients");
  const videoThumbnail = c?.videoThumbnail || "/assets/hero/video-family.png";
  const { ref: sectionRef, isActive } =
    useViewportActivity<HTMLElement>("200px 0px");

  return (
    <section
      ref={sectionRef}
      id="hero-video"
      className="relative max-sm:pt-16 z-20"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/landing-hero.svg')] bg-cover bg-top bg-no-repeat" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 md:z-10">
        <div className="absolute -left-6 -top-16 h-36 w-36 sm:-left-12 sm:-top-16 sm:h-44 sm:w-44 md:-left-8 md:-top-40 md:h-[340px] md:w-[340px] lg:left-0 lg:-top-80 lg:h-[540px] lg:w-[540px]">
          <Image
            src="/assets/hero/doctor-duck.png"
            alt="Doctor Duck"
            fill
            loading="eager"
            decoding="async"
            quality={85}
            sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, (max-width: 1024px) 340px, 540px"
            className="object-contain drop-shadow-2xl"
          />
        </div>

        <div className="absolute -right-4 -top-12 h-32 w-32 sm:-right-6 sm:-top-10 sm:h-40 sm:w-40 md:-right-4 md:-top-28 md:h-[300px] md:w-[300px] lg:right-0 lg:-top-60 lg:h-[500px] lg:w-[500px]">
          <Image
            src="/assets/hero/cream-sandwich-stack.png"
            alt="Biscuit Stack"
            fill
            loading="eager"
            decoding="async"
            quality={85}
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 300px, 500px"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto flex max-w-[1440px] flex-col px-4 sm:px-6 md:px-10 pb-16 pt-20 sm:pt-24 md:pb-36 md:pt-40 lg:px-16 lg:pb-44 lg:pt-52">
        <div className="flex max-w-6xl flex-col items-start text-left px-1 sm:px-0">
          <blockquote className="max-w-4xl font-['Outfit'] text-[26px] leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.02em] text-white">
            "{secondaryQuote}"
          </blockquote>

          <div className="mt-8 sm:mt-10 flex items-center gap-4 sm:gap-5">
            <ClientAvatars />
            <span className="font-['Outfit'] text-base sm:text-lg md:text-xl font-semibold text-white">
              {ourClients}
            </span>
          </div>
        </div>

        <div className="relative mt-14 sm:mt-20 md:mt-24 lg:mt-32 w-full overflow-hidden">
          <MarqueeBanner t={t} isActive={isActive} />

          <div className="relative z-10 mx-auto max-w-[1380px] px-1 sm:px-0">
            <div className="group relative aspect-video overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[32px] border-4 border-white bg-[#404040] shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:rounded-[48px] lg:rounded-[52px]">
              <Image
                src={videoThumbnail}
                alt="Family enjoying Vita"
                fill
                loading="eager"
                fetchPriority="high"
                decoding="async"
                quality={85}
                sizes="(max-width: 640px) 96vw, (max-width: 1024px) 92vw, 1380px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/30 sm:bg-black/20 transition-all duration-500 group-hover:bg-black/5" />

              <button
                aria-label="Mute video"
                className="absolute left-3 top-3 sm:left-4 sm:top-4 flex h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-all hover:scale-110 md:left-8 md:top-8"
              >
                <Image
                  src="/assets/hero/sound-mute-video.svg"
                  alt="Mute"
                  fill
                  unoptimized
                  loading="eager"
                  decoding="async"
                  sizes="56px"
                  className="p-2.5 sm:p-3"
                />
              </button>

              <button
                aria-label="Play video"
                className="absolute inset-0 m-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-md transition-all active:scale-95 hover:scale-110 hover:bg-white/40"
              >
                <Play className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white fill-white ml-0.5" />
              </button>
            </div>

            <div className="absolute -right-3 -top-6 sm:-right-6 sm:-top-10 md:-right-8 md:-top-12 z-30 h-20 w-20 sm:h-24 sm:w-24 md:h-40 md:w-40 lg:h-[215px] lg:w-[215px] rotate-[10deg] drop-shadow-2xl transition-transform duration-700 hover:rotate-[20deg]">
              <Image
                src="/assets/hero/badge.svg"
                alt="Quality Badge"
                fill
                unoptimized
                loading="eager"
                decoding="async"
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 160px, 215px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
