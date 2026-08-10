"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@frontend/navigation";
import { products } from "@frontend/app/[locale]/products/data";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useViewportActivity } from "@/hooks/useViewportActivity";

export default function ProductsSection() {
  const t = useTranslations("Products");
  const tPage = useTranslations("ProductsPage");
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [autoplayPlugin.current],
  );
  const { ref: activityRef, isActive: sectionIsActive } =
    useViewportActivity<HTMLDivElement>("200px 0px");

  const syncSelectedIndex = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    syncSelectedIndex();
    emblaApi.on("select", syncSelectedIndex);
    emblaApi.on("reInit", syncSelectedIndex);

    return () => {
      emblaApi.off("select", syncSelectedIndex);
      emblaApi.off("reInit", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    if (!sectionIsActive) {
      autoplay.stop();
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      // Embla can expose the API before the autoplay plugin has a usable snap
      // list during the first React effect. Only resume after layout/init has
      // produced at least one snap, and never restart an already-running timer.
      if (emblaApi.scrollSnapList().length > 0 && !autoplay.isPlaying()) {
        autoplay.play();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [emblaApi, sectionIsActive]);

  return (
    <section
      id="products"
      className="relative w-full overflow-hidden"
      ref={emblaRef}
    >
      <div
        ref={activityRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="flex flex-row cursor-grab active:cursor-grabbing">
        {products.map((product, index) => {
          const translationKey = `items.${product.id}.name`;
          const burgerFlourWeight = product.id.match(
            /^burger-flour-(\d+kg)$/,
          )?.[1];
          const productName = t.has(translationKey)
            ? t(translationKey)
            : burgerFlourWeight && t.has("items.burger-flour.name")
              ? `${t("items.burger-flour.name")} ${burgerFlourWeight}`
              : product.name;

          const shouldAnimateSlide = sectionIsActive && selectedIndex === index;
          const animationStyle = {
            animationPlayState: shouldAnimateSlide ? "running" : "paused",
            willChange: shouldAnimateSlide ? "transform" : "auto",
          } as const;

          return (
            <div
              key={product.id}
              className="relative min-w-full h-[500px] lg:h-[700px] overflow-hidden flex flex-col items-center justify-center shrink-0"
            >
              <div
                className="absolute inset-0 z-0"
                style={{ background: product.ui.bgColor }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-overlay opacity-70 px-4">
                <h2 className="font-['Funnel_Display'] font-black text-[26vw] sm:text-[24vw] md:text-[22vw] text-white leading-none uppercase tracking-tight whitespace-nowrap drop-shadow-sm select-none">
                  {productName}
                </h2>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div
                  className="relative w-[90vw] max-w-[1200px] aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] animate-product-float drop-shadow-2xl"
                  style={animationStyle}
                >
                  <Image
                    src={product.media.image}
                    alt={`Vita ${productName}`}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    quality={85}
                    sizes="(max-width: 640px) 90vw, (max-width: 1280px) 90vw, 1200px"
                    className={`object-contain ${
                      index % 2 === 0
                        ? "rotate-[-2deg]"
                        : "rotate-[15deg] lg:rotate-0"
                    }`}
                  />
                </div>
              </div>

              <div
                className="absolute left-[12%] top-[15%] w-20 h-20 lg:w-40 lg:h-40 z-30 animate-product-float-delayed pointer-events-none drop-shadow-xl filter blur-[4px]"
                style={animationStyle}
              >
                <Image
                  src="/assets/hero/cookie-decoration-1.png"
                  alt=""
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  quality={75}
                  sizes="(max-width: 1024px) 80px, 160px"
                  className="object-contain rotate-[33deg]"
                />
              </div>

              <div
                className="absolute left-[22%] top-[25%] w-10 h-10 lg:w-16 lg:h-16 z-10 animate-product-float pointer-events-none drop-shadow-md"
                style={animationStyle}
              >
                <Image
                  src="/assets/hero/cookie-decoration-1.png"
                  alt=""
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  quality={75}
                  sizes="(max-width: 1024px) 40px, 64px"
                  className="object-contain rotate-[21deg]"
                />
              </div>

              <div className="absolute right-[-5%] bottom-[5%] w-48 h-48 lg:w-[400px] lg:h-[400px] z-40 pointer-events-none filter blur-[8px] sm:blur-[12px] drop-shadow-2xl transform rotate-[15deg]">
                <Image
                  src="/assets/hero/cookie-decoration-1.png"
                  alt=""
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  quality={75}
                  sizes="(max-width: 1024px) 192px, 400px"
                  className="object-contain scale-125 animate-product-float"
                  style={animationStyle}
                />
              </div>

              <div className="absolute bottom-10 left-10 lg:bottom-[10%] lg:left-[8%] z-30 flex flex-col items-start cursor-pointer group">
                <Link
                  href={`/products/${product.id}`}
                  className="flex flex-col gap-1"
                >
                  <h3
                    className="font-['Funnel_Display'] font-semibold text-[28px] lg:text-[48px] leading-none flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-2"
                    style={{ color: product.ui.textColor }}
                  >
                    Vita {productName}
                    <span
                      className="text-[20px] lg:text-[48px] font-light"
                      style={{ color: product.ui.textColor }}
                    >
                      ↗
                    </span>
                  </h3>
                  <p
                    className="font-['Funnel_Display'] font-medium text-[14px] lg:text-[24px] tracking-tight mt-1"
                    style={{ color: product.ui.textColor }}
                  >
                    {tPage(`categories.${product.category.toLowerCase()}`)}
                  </p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
