"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Link } from "@frontend/navigation";
import { useViewportActivity } from "@/hooks/useViewportActivity";

type BrandIcon = {
  name: string;
  src: string;
};

const tagIcons: BrandIcon[] = [
  { name: "Bora", src: "/assets/products/tag_icons/optimized/bora.png" },
  { name: "Chewata", src: "/assets/products/tag_icons/optimized/chewata.png" },
  { name: "Cream", src: "/assets/products/tag_icons/optimized/cream.png" },
  { name: "Digestive", src: "/assets/products/tag_icons/optimized/digestive.png" },
  { name: "Glucose", src: "/assets/products/tag_icons/optimized/glucose.png" },
  { name: "Marie", src: "/assets/products/tag_icons/optimized/marie.png" },
  { name: "Oreo", src: "/assets/products/tag_icons/optimized/oreo.png" },
  { name: "Sina", src: "/assets/products/tag_icons/optimized/sina.png" },
  { name: "Tafach", src: "/assets/products/tag_icons/optimized/tafach.png" },
  { name: "Tea", src: "/assets/products/tag_icons/optimized/tea.png" },
  { name: "Zoo", src: "/assets/products/tag_icons/optimized/zoo.png" },
];

type LocalizedSectionContent = {
  label?: string;
  title?: string;
  description?: string;
  cta?: string;
};

type BiscuitBrandSectionProps = {
  content?: Record<string, LocalizedSectionContent>;
  locale?: string;
};

export default function BiscuitBrandSection({
  content,
  locale,
}: BiscuitBrandSectionProps) {
  const t = useTranslations("BiscuitBrand");
  const localizedContent =
    (locale ? content?.[locale] : undefined) ?? content?.en;
  const { ref: sectionRef, isActive: sectionIsActive } =
    useViewportActivity<HTMLElement>("250px 0px");

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
    }),
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      dragFree: false,
      skipSnaps: false,
      containScroll: false,
      duration: 28,
    },
    [autoplayPlugin.current],
  );

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    handleSelect();
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi, handleSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    if (!sectionIsActive) {
      autoplay.stop();
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (emblaApi.scrollSnapList().length > 0 && !autoplay.isPlaying()) {
        autoplay.play();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [emblaApi, sectionIsActive]);

  return (
    <section
      ref={sectionRef}
      id="biscuit-brand"
      className="relative flex min-h-[860px] w-full flex-col items-center overflow-hidden bg-white pb-40 pt-24 sm:pb-48 lg:min-h-[960px] lg:pb-[220px] lg:pt-32"
    >
      <div className="pointer-events-none absolute bottom-[-35px] left-[-60px] z-10 h-[210px] w-[210px] -rotate-[26deg] opacity-95 sm:bottom-[-20px] sm:left-[-100px] sm:h-[320px] sm:w-[320px] lg:bottom-[10px] lg:left-[-150px] lg:h-[450px] lg:w-[450px]">
        <Image
          src="/assets/products/biscuts/biscut-5.png"
          alt=""
          fill
          loading="lazy"
          decoding="async"
          quality={90}
          sizes="(max-width: 640px) 210px, (max-width: 1024px) 320px, 450px"
          className="object-contain"
        />
      </div>

      <div className="pointer-events-none absolute bottom-[-35px] right-[-60px] z-10 h-[210px] w-[210px] rotate-[22deg] opacity-95 sm:bottom-[-20px] sm:right-[-100px] sm:h-[320px] sm:w-[320px] lg:bottom-[10px] lg:right-[-150px] lg:h-[450px] lg:w-[450px]">
        <Image
          src="/assets/products/biscuts/biscut-1.png"
          alt=""
          fill
          loading="lazy"
          decoding="async"
          quality={90}
          sizes="(max-width: 640px) 210px, (max-width: 1024px) 320px, 450px"
          className="object-contain"
        />
      </div>

      <div className="relative z-20 flex w-full flex-col items-center">
        <div className="mb-10 flex flex-col items-center gap-4 px-6 text-center sm:mb-14 lg:mb-16">
          <p className="font-['Funnel_Display'] text-[14px] font-semibold uppercase tracking-[0.15em] text-[#404040]/60 sm:text-[16px]">
            {localizedContent?.label || t("label")}
          </p>

          <h2 className="max-w-4xl font-['Outfit'] text-[40px] font-black capitalize leading-[1.05] tracking-tight text-[#23B349] sm:text-[56px] lg:text-[72px]">
            {localizedContent?.title
              ? localizedContent.title
              : t.rich("title", { br: () => <br /> })}
          </h2>
        </div>

        <div className="relative my-8 flex w-full items-center justify-center sm:my-12 lg:my-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 opacity-[0.055] sm:h-[520px] sm:w-[520px] lg:h-[680px] lg:w-[680px]"
            style={{
              backgroundColor: "#282828",
              maskImage: "url('/product-vector.svg')",
              WebkitMaskImage: "url('/product-vector.svg')",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />

          <div
            ref={emblaRef}
            className="relative z-10 h-[300px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]"
          >
            <div className="flex h-full touch-pan-y items-center">
              {tagIcons.map((icon, index) => {
                const isActive = selectedIndex === index;
                const rawDistance = Math.abs(selectedIndex - index);
                const loopDistance = Math.min(
                  rawDistance,
                  tagIcons.length - rawDistance,
                );
                const isNearActive = loopDistance <= 1;
                const shouldPromote = sectionIsActive && isNearActive;

                return (
                  <div
                    key={icon.name}
                    className="relative h-full min-w-0 shrink-0 basis-[76%] sm:basis-[45%] lg:basis-[32%]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-3 lg:px-4">
                      <div className="relative flex h-[260px] w-full max-w-[520px] items-center justify-center sm:h-[310px] sm:max-w-[620px] lg:h-[360px] lg:max-w-[720px]">
                        <div
                          className={[
                            "relative h-full w-full",
                            "transition-[transform,opacity] duration-700",
                            "ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isActive
                              ? "z-20 scale-100 opacity-100"
                              : "z-10 scale-[0.76] opacity-55",
                          ].join(" ")}
                          style={{
                            willChange: shouldPromote ? "transform, opacity" : "auto",
                          }}
                        >
                          <Image
                            src={icon.src}
                            alt={`${icon.name} biscuit brand`}
                            fill
                            loading={sectionIsActive && isNearActive ? "eager" : "lazy"}
                            fetchPriority={
                              sectionIsActive && isActive ? "high" : "auto"
                            }
                            decoding="async"
                            quality={90}
                            draggable={false}
                            sizes="(max-width: 640px) 76vw, (max-width: 1024px) 45vw, 32vw"
                            className="pointer-events-none select-none object-contain mix-blend-screen"
                            style={{
                              filter: isActive
                                ? "contrast(1.12) saturate(1.15) brightness(1.02) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.12))"
                                : "contrast(1.08) saturate(1.08) brightness(1.02) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.05))",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-6 flex flex-col items-center gap-8 px-6 text-center sm:mt-10 lg:mt-14">
          <p className="max-w-xl font-['Funnel_Display'] text-[14px] font-medium leading-relaxed text-[#404040]/80 sm:text-[16px] lg:text-[18px]">
            {localizedContent?.description
              ? localizedContent.description
              : t.rich("description", {
                  br: () => <br className="hidden sm:block" />,
                })}
          </p>

          <Link
            href="/products"
            className="group flex items-center gap-3 rounded-full bg-[#23B349] px-8 py-4 text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:bg-[#1f9d40] active:scale-[0.98]"
          >
            <span className="font-['Funnel_Display'] text-[16px] font-bold">
              {localizedContent?.cta || t("cta")}
            </span>
            <span className="flex items-center justify-center rounded-full bg-white/20 p-1 transition-transform duration-300 group-hover:translate-x-1">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
