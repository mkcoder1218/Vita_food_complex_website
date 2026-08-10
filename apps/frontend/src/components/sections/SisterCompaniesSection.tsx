"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useViewportActivity } from "@/hooks/useViewportActivity";

export default function SisterCompaniesSection({
  content,
  locale,
}: {
  content?: any;
  locale?: string;
}) {
  const t = useTranslations("About.sisterCompanies");
  const c = content?.[locale as string] || content?.en;
  const { ref: sectionRef, isActive } =
    useViewportActivity<HTMLElement>("200px 0px");

  const cmsLogos: Array<{ src?: string; alt?: string }> = (c?.logos || []).filter(
    (l: any) => l && typeof l.src === "string" && l.src.trim() !== "",
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden py-16 sm:py-24"
    >
      <div className="max-w-[1024px] mx-auto px-5 flex flex-col items-center text-center mb-16">
        <p className="font-['Funnel_Display'] font-medium text-[16px] sm:text-[18px] text-[#404040] mb-3">
          {c?.subtitle || "Sister Companies"}
        </p>
        <h2 className="font-['Outfit'] font-bold text-[36px] sm:text-[48px] lg:text-[60px] text-[#23B349] leading-tight tracking-tight">
          {c?.heading || "Different Experiences"}
        </h2>
      </div>

      {cmsLogos.length > 0 && (
        <div className="relative w-full overflow-hidden py-8 mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

          <div
            className="flex items-center animate-marquee whitespace-nowrap"
            style={{
              gap: "200px",
              animationPlayState: isActive ? "running" : "paused",
              willChange: isActive ? "transform" : "auto",
            }}
          >
            {cmsLogos.map((logo, idx) => (
              <div
                key={`logo-a-${idx}`}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-4"
              >
                <Image
                  src={logo.src as string}
                  alt={logo.alt || `Sister Company ${idx + 1}`}
                  width={240}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  quality={85}
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 180px, 240px"
                  className="object-contain h-[80px] sm:h-[120px] lg:h-[150px] w-auto hover:scale-105 transition-transform duration-500"
                />
                {logo.alt && (
                  <p className="font-['Outfit'] font-semibold text-[16px] text-[#404040] tracking-wide">
                    {logo.alt}
                  </p>
                )}
              </div>
            ))}

            {cmsLogos.map((logo, idx) => (
              <div
                key={`logo-b-${idx}`}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-4"
              >
                <Image
                  src={logo.src as string}
                  alt={logo.alt || `Sister Company ${idx + 1}`}
                  width={240}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  quality={85}
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 180px, 240px"
                  className="object-contain h-[80px] sm:h-[120px] lg:h-[150px] w-auto hover:scale-105 transition-transform duration-500"
                />
                {logo.alt && (
                  <p className="font-['Outfit'] font-semibold text-[16px] text-[#404040] tracking-wide">
                    {logo.alt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[800px] mx-auto px-5 flex flex-col items-center text-center gap-8">
        <p className="font-['Funnel_Display'] text-[14px] sm:text-[16px] text-[#404040] leading-relaxed max-w-[450px]">
          {c?.description ||
            "Through our diverse sister companies, we deliver value across every touchpoint of everyday life."}
        </p>
        <Link
          href={c?.link || "/about#sister-companies"}
          className="inline-flex items-center justify-center gap-2 bg-[#23B349] hover:bg-[#1d963c] text-white font-['Funnel_Display'] text-[14px] px-6 py-2 rounded-full transition-colors duration-300"
        >
          {c?.cta || "See more"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
