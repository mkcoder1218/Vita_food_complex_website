"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@frontend/navigation";
import { products } from "@frontend/app/[locale]/products/data";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function ProductsSection() {
  const t = useTranslations("Products");
  const t_page = useTranslations("ProductsPage");
  const [emblaRef] = useEmblaCarousel(
    { align: "start", loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  return (
    <section id="products" className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex flex-row cursor-grab active:cursor-grabbing">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="relative min-w-full h-[500px] lg:h-[700px] overflow-hidden flex flex-col items-center justify-center shrink-0"
          >
          {/* Background Gradient */}
          <div 
            className="absolute inset-0 z-0" 
            style={{ background: product.ui.bgColor }} 
          />

          {/* Background Large Text (Perfectly centered via flex) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-overlay opacity-70 px-4">
            <h2 className="font-['Funnel_Display'] font-black text-[26vw] sm:text-[24vw] md:text-[22vw] text-white leading-none uppercase tracking-tight whitespace-nowrap drop-shadow-sm select-none">
              {t(`items.${product.id}.name`)}
            </h2>
          </div>

          {/* Center: Product Image */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-[90vw] max-w-[1200px] aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] animate-product-float drop-shadow-2xl">
              <Image
                src={product.media.image}
                alt={`Vita ${t(`items.${product.id}.name`)}`}
                fill
                className={`object-contain ${index % 2 === 0 ? "rotate-[-2deg]" : "rotate-[15deg] lg:rotate-0"}`}
                priority={index < 2}
              />
            </div>
          </div>

          {/* Decorative elements - Left side cookies */}
          <div className="absolute left-[12%] top-[15%] w-20 h-20 lg:w-40 lg:h-40 z-30 animate-product-float-delayed pointer-events-none drop-shadow-xl filter blur-[4px]">
            <Image
              src="/assets/hero/cookie-decoration-1.png"
              alt=""
              fill
              className="object-contain rotate-[33deg]"
            />
          </div>
          <div className="absolute left-[22%] top-[25%] w-10 h-10 lg:w-16 lg:h-16 z-10 animate-product-float pointer-events-none drop-shadow-md">
            <Image
              src="/assets/hero/cookie-decoration-1.png"
              alt=""
              fill
              className="object-contain rotate-[21deg]"
            />
          </div>

          {/* Decorative elements - Right side foreground blurred cookie */}
          <div className="absolute right-[-5%] bottom-[5%] w-48 h-48 lg:w-[400px] lg:h-[400px] z-40 pointer-events-none filter blur-[8px] sm:blur-[12px] drop-shadow-2xl transform rotate-[15deg]">
            <Image
              src="/assets/hero/cookie-decoration-1.png"
              alt=""
              fill
              className="object-contain scale-125 animate-product-float"
            />
          </div>

          {/* Bottom Left: Text Content */}
          <div className="absolute bottom-10 left-10 lg:bottom-[10%] lg:left-[8%] z-30 flex flex-col items-start cursor-pointer group">
            <Link href={`/products/${product.id}`} className="flex flex-col gap-1">
              <h3 
                className="font-['Funnel_Display'] font-semibold text-[28px] lg:text-[48px] leading-none flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-2"
                style={{ color: product.ui.textColor }}
              >
                Vita {t(`items.${product.id}.name`)}
                <span className="text-[20px] lg:text-[48px] font-light" style={{ color: product.ui.textColor }}>
                  ↗
                </span>
              </h3>
              <p 
                className="font-['Funnel_Display'] font-medium text-[14px] lg:text-[24px] tracking-tight mt-1"
                style={{ color: product.ui.textColor }}
              >
                {t_page(`categories.${product.category.toLowerCase()}`)}
              </p>
            </Link>
          </div>
        </div>
      ))}
      </div>
    </section>
  );
}
