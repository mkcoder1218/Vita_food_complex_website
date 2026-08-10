"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useViewportActivity } from "@/hooks/useViewportActivity";

interface CertLogo {
  alt: string;
  src: string;
  width: number;
}

const DEFAULT_LOGOS: CertLogo[] = [
  { alt: "Fortified Food", src: "/assets/quality/figma/cert_1.png", width: 150 },
  { alt: "EFDA", src: "/assets/quality/figma/cert_efda.png", width: 280 },
  { alt: "LRQA", src: "/assets/quality/figma/cert_lrqa.png", width: 150 },
  { alt: "ISO 9001", src: "/assets/quality/figma/cert_iso.png", width: 150 },
  { alt: "EAS", src: "/assets/quality/figma/cert_eas.png", width: 320 },
];

export default function PartnerSection({
  content,
  locale,
}: {
  content?: any;
  locale?: string;
}) {
  const t = useTranslations("Partner");
  const c = content?.[locale as string] || content?.en;
  const { ref: sectionRef, isActive } =
    useViewportActivity<HTMLElement>("200px 0px");
  const certLogos: CertLogo[] =
    c?.logos && c.logos.length > 0
      ? c.logos.map((l: any, i: number) => ({
          alt: l.alt,
          src: l.url,
          width: DEFAULT_LOGOS[i]?.width || 150,
        }))
      : DEFAULT_LOGOS;

  return (
    <section
      ref={sectionRef}
      id="quality"
      className="relative w-full bg-white overflow-hidden py-12 sm:py-16 lg:py-24"
    >
      <div className="max-w-[1024px] mx-auto px-5 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-4 mb-12 sm:mb-16">
        <p className="font-['Funnel_Display'] font-medium text-lg sm:text-[20px] text-[#404040] leading-tight">
          {c?.subtitle || t("subtitle")}
        </p>
        <h2 className="font-['Outfit'] font-black text-[42px] sm:text-[52px] lg:text-[80px] text-[#23B349] leading-[0.92] sm:leading-[0.9] tracking-[-0.02em]">
          {c?.heading || t("heading")}
        </h2>
      </div>

      <div className="relative w-full overflow-hidden py-6 sm:py-8">
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 lg:w-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, white, transparent)",
          }}
        />

        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 lg:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />

        <div
          className="flex items-center animate-marquee"
          style={{
            gap: "80px",
            animationPlayState: isActive ? "running" : "paused",
            willChange: isActive ? "transform" : "auto",
          }}
        >
          {certLogos.map((logo, i) => (
            <div
              key={`a-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-[110px] sm:h-[130px] lg:h-[150px]"
              style={{
                width: logo.width * 0.75,
                minWidth: logo.width * 0.75,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={150}
                loading="lazy"
                decoding="async"
                quality={85}
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 320px"
                className="object-contain h-[92px] sm:h-[110px] lg:h-[130px] w-auto hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}

          {certLogos.map((logo, i) => (
            <div
              key={`b-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-[110px] sm:h-[130px] lg:h-[150px]"
              style={{
                width: logo.width * 0.75,
                minWidth: logo.width * 0.75,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={150}
                loading="lazy"
                decoding="async"
                quality={85}
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 320px"
                className="object-contain h-[92px] sm:h-[110px] lg:h-[130px] w-auto hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
