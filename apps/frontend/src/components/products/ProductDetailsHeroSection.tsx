"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@frontend/app/[locale]/products/data";

interface ProductHeroSectionProps {
  product: Product;
}

export default function ProductHeroSection({
  product,
}: ProductHeroSectionProps) {
  const [activeVariationIndex, setActiveVariationIndex] = useState<number | null>(null);

  const activeVariation =
    activeVariationIndex !== null && product.colorVariations
      ? product.colorVariations[activeVariationIndex]
      : null;

  const isBora = product.id === "bora";
  const currentBgColor = isBora
    ? "linear-gradient(135deg, #F5F5F5 0%, #E5E5E5 100%)"
    : activeVariation
      ? activeVariation.bgColor
      : product.ui.bgColor;

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 transition-colors duration-500"
      style={{
        background: currentBgColor,
        maskImage: `url('/wave-2.svg')`,
        WebkitMaskImage: `url('/wave-2.svg')`,
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskPosition: "bottom center",
        WebkitMaskPosition: "bottom center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full flex flex-col items-center text-center px-4 max-w-[1200px] mx-auto">
        <div className="relative w-full flex justify-center items-center pointer-events-none select-none z-0">
          <div className="relative inline-block">
            <h1
              className="font-['Funnel_Display'] font-black text-6xl xs:text-7xl sm:text-8xl md:text-[9rem] lg:text-[10rem] tracking-tight leading-none text-center whitespace-nowrap drop-shadow-md"
              style={{ color: product.ui.nameColor }}
            >
              {product.name}
            </h1>
          </div>
        </div>

        <div className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[460px] md:max-w-[620px] lg:max-w-[720px] aspect-[1.5] z-20 -mt-6 sm:-mt-12 md:-mt-16 lg:-mt-20 flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.04] pointer-events-none z-0">
            <Image
              src="/assets/product-vector.svg"
              alt="Vita Background Crest"
              fill
              unoptimized
              loading="eager"
              decoding="async"
              sizes="(max-width: 640px) 336px, (max-width: 768px) 408px, (max-width: 1024px) 744px, 864px"
              className="object-contain"
            />
          </div>

          <Image
            src={product.media.image}
            alt={product.name}
            fill
            loading="eager"
            fetchPriority="high"
            decoding="async"
            quality={90}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 460px, (max-width: 1024px) 620px, 720px"
            className={`object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.16)] hover:-translate-y-2 transition-all duration-500 z-10 ${
              product.category === "Flour"
                ? "scale-95 rotate-[35deg] hover:rotate-[15deg]"
                : "scale-110"
            }`}
          />
        </div>

        {product.colorVariations && product.colorVariations.length > 0 && (
          <div className="relative z-20 flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setActiveVariationIndex(null)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                activeVariationIndex === null
                  ? "border-white scale-125 shadow-lg"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: product.ui.bgColor }}
              aria-label="Default color"
            />
            {product.colorVariations.map((variation, idx) => (
              <button
                key={idx}
                onClick={() => setActiveVariationIndex(idx)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  activeVariationIndex === idx
                    ? "border-white scale-125 shadow-lg"
                    : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: variation.colorCode }}
                aria-label={`Color variation ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {product.content?.netWeight && (
          <div
            className="relative z-20 mt-6 px-5 py-2 rounded-full backdrop-blur-md border text-xs sm:text-sm font-['Outfit'] font-bold tracking-wide uppercase transition-all duration-300"
            style={{
              color: product.ui.textColor,
              borderColor: `${product.ui.textColor}33`,
              backgroundColor: `${product.ui.textColor}0A`,
            }}
          >
            {product.content.netWeight.includes(",")
              ? "Available Sizes"
              : "Net Weight"}
            : {product.content.netWeight}
          </div>
        )}
      </div>
    </section>
  );
}
