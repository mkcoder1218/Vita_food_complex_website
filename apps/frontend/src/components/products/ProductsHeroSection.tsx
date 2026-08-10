"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";

interface ProductsHeroProps {
  title: string;
  subtitle: string;
  products: Array<{
    id: string;
    name: string;
    media: { image: string };
    ui: { bgColor: string };
  }>;
}

export const ProductsHeroSection = memo(
  ({ title, subtitle, products }: ProductsHeroProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderProducts =
      products.length > 0
        ? products
        : [
            {
              id: "fallback",
              name: title,
              media: { image: "/assets/products/items/zoo-1.png" },
              ui: {
                bgColor: "linear-gradient(135deg, #23B349 0%, #1a9e3e 100%)",
              },
            },
          ];

    useEffect(() => {
      if (sliderProducts.length <= 1) return;
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderProducts.length);
      }, 4000);
      return () => clearInterval(timer);
    }, [sliderProducts.length]);

    return (
      <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[95vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            maskImage: `url('/product-hero.svg')`,
            WebkitMaskImage: `url('/product-hero.svg')`,
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskPosition: "bottom center",
            WebkitMaskPosition: "bottom center",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          {sliderProducts.map((product, idx) => (
            <div
              key={`bg-${product.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ background: product.ui.bgColor }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="absolute right-0 top-0 w-1/2 h-[70%] bg-[url('/assets/pattern.png')] bg-cover bg-no-repeat" />
        </div>

        <div className="absolute inset-0 z-0 max-w-[1600px] mx-auto px-6 lg:px-20 flex items-center justify-between w-full pointer-events-none select-none pb-20">
          <h1 className="font-['Funnel_Display'] font-black text-[5rem] md:text-[8rem] lg:text-[12rem] xl:text-[13rem] text-white leading-none drop-shadow-md tracking-tighter text-left">
            {title}
          </h1>
          <div className="hidden md:block text-right">
            <p className="font-['Outfit'] font-bold text-sm text-white/90 tracking-wider uppercase drop-shadow-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="absolute left-0 top-[55%] -translate-y-1/2 w-full z-20 pointer-events-none">
          <div
            className="flex transition-transform duration-1000 ease-in-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sliderProducts.map((product, index) => (
              <div
                key={product.id}
                className="w-full flex-shrink-0 flex justify-center items-center"
              >
                <div className="relative w-full max-w-[500px] md:max-w-[900px] lg:max-w-[1200px] aspect-[1.8]">
                  <Image
                    src={product.media.image}
                    alt={product.name}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    quality={85}
                    sizes="(max-width: 768px) 500px, (max-width: 1024px) 900px, 1200px"
                    className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="absolute top-[28%] lg:top-[35%] left-[5%] lg:left-[10%] w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 drop-shadow-xl z-10">
            <Image
              src="/assets/products/biscuts/biscut-1.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 192px"
              className="object-contain -rotate-12"
            />
          </div>

          <div className="absolute top-[20%] lg:top-[25%] left-[20%] lg:left-[22%] w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 drop-shadow-md">
            <Image
              src="/assets/products/biscuts/biscut-6.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 24px, (max-width: 1024px) 32px, 40px"
              className="object-contain rotate-45"
            />
          </div>

          <div className="absolute top-[25%] lg:top-[20%] left-[25%] lg:left-[28%] w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 drop-shadow-md">
            <Image
              src="/assets/products/biscuts/biscut-4.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 56px"
              className="object-contain rotate-[30deg]"
            />
          </div>

          <div className="absolute bottom-[20%] lg:bottom-[15%] left-[10%] lg:left-[12%] w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-xl">
            <Image
              src="/assets/products/biscuts/biscut-2.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
              className="object-contain rotate-[15deg]"
            />
          </div>

          <div className="absolute bottom-[10%] lg:bottom-[18%] left-[15%] lg:left-[19%] w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 drop-shadow-md">
            <Image
              src="/assets/products/biscuts/biscut-5.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 48px"
              className="object-contain -rotate-45"
            />
          </div>

          <div className="absolute bottom-[-5%] lg:bottom-[-10%] right-[-5%] lg:right-[-2%] w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] drop-shadow-2xl blur-[4px] lg:blur-[6px] z-30">
            <Image
              src="/assets/products/biscuts/biscut-3.png"
              alt=""
              fill
              loading="lazy"
              decoding="async"
              quality={75}
              sizes="(max-width: 768px) 256px, (max-width: 1024px) 384px, 500px"
              className="object-contain rotate-[-20deg]"
            />
          </div>
        </div>
      </section>
    );
  },
);
ProductsHeroSection.displayName = "ProductsHeroSection";
