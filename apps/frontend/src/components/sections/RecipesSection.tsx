"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";

const recipes = [
  {
    id: 1,
    title: "Creamy Delights",
    description:
      "Experience the rich, velvety texture of our signature cream biscuits.",
    image: "/assets/recipes/recipe-1.png",
    color: "#2976CA",
  },
  {
    id: 2,
    title: "Oreo Moments",
    description: "Perfectly balanced chocolate and cream for your tea time.",
    image: "/assets/recipes/recipe-2.png",
    color: "#1648B5",
  },
  {
    id: 3,
    title: "Sweet Bites",
    description: "Small, crunchy treats that bring big smiles to everyone.",
    image: "/assets/recipes/recipe-3.png",
    color: "#23B349",
  },
  {
    id: 4,
    title: "Morning Fresh",
    description: "Start your day with our high-quality wheat flour bakes.",
    image: "/assets/recipes/recipe-4.png",
    color: "#7E4627",
  },
  {
    id: 5,
    title: "Baker's Secret",
    description: "The secret ingredient to all your favorite home recipes.",
    image: "/assets/recipes/recipe-5.png",
    color: "#A099B5",
  },
];

export default function RecipesSection({ content, locale }: { content?: any; locale?: string }) {
  const t = useTranslations("Recipes");
  const c = content?.[locale as string] || content?.en;
  const t_items = (c?.items || t.raw("items")) as { title: string; description: string; image?: string }[];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <section
      id="recipes"
      className="relative w-full bg-white py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 mb-10 sm:mb-14 md:mb-20 flex flex-col items-center text-center">
        <p className="font-['Funnel_Display'] font-semibold text-base sm:text-lg md:text-[20px] text-[#23B349] tracking-widest uppercase mb-3">
          {c?.label || t("header.label")}
        </p>
        <h2 className="font-['Outfit'] font-black text-[42px] sm:text-5xl md:text-[64px] lg:text-[80px] text-[#404040] leading-[1.05] tracking-[-0.02em] px-2">
          {c?.heading
            ? c.heading
            : t.rich("header.heading", { enjoy: (chunks) => <span className="text-[#23B349]">{chunks}</span> })}
        </h2>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-12 px-5 sm:px-6 md:px-12 lg:px-24 scrollbar-hide snap-x snap-mandatory -mx-1 scroll-smooth"
        >
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="relative shrink-0 w-[230px] sm:w-[270px] md:w-[320px] lg:w-[420px] 
                         h-[340px] sm:h-[410px] md:h-[460px] lg:h-[530px] 
                         rounded-3xl sm:rounded-[32px] md:rounded-[40px] overflow-hidden 
                         snap-center group cursor-pointer shadow-2xl flex flex-col 
                         transition-all duration-500 hover:scale-[1.02] active:scale-[0.97]"
            >
              {/* Image Area */}
              <div className="relative w-full h-[58%] overflow-hidden bg-[#F3F3F3]">
                <Image
                  src={t_items[index]?.image || recipe.image}
                  alt={t_items[index]?.title || recipe.title}
                  fill
                  loading="lazy"
                  decoding="async"
                  quality={80}
                  sizes="(max-width: 640px) 230px, (max-width: 768px) 270px, (max-width: 1024px) 320px, 420px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Curvy divider between image and content */}
              <svg
                className="absolute left-0 w-full h-10 sm:h-12 md:h-14 lg:h-16 z-10 pointer-events-none"
                style={{ top: "58%", transform: "translateY(-55%)" }}
                viewBox="0 0 500 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C160,55 340,55 500,0 L500,100 L0,100 Z"
                  fill={recipe.color}
                />
              </svg>

              {/* Content Area */}
              <div
                className="relative w-full h-[42%] p-5 sm:p-7 md:p-8 flex flex-col justify-center gap-2 sm:gap-3"
                style={{ backgroundColor: recipe.color }}
              >
                {/* Floating Arrow */}
                <div className="absolute -top-5 sm:-top-6 md:-top-7 right-5 z-20 w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={recipe.color}
                    strokeWidth="3.5"
                    className="translate-x-[1px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </div>

                <h3 className="font-['Funnel_Display'] font-bold text-[22px] sm:text-[26px] md:text-[32px] lg:text-[36px] text-white leading-tight pr-10">
                  {t_items[index]?.title || recipe.title}
                </h3>

                <p className="font-['Outfit'] font-normal text-[13px] sm:text-[15px] md:text-[16px] text-white/90 leading-relaxed line-clamp-3">
                  {t_items[index]?.description || recipe.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 mt-6 sm:mt-8">
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#23B349] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(8, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
