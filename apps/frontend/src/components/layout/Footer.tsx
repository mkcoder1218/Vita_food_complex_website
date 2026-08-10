"use client";

import Image from "next/image";
import { Link } from "@frontend/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import api from "@/lib/api";

function FacebookIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function InstagramIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

function TikTokIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const headingClass =
  "font-['Outfit'] font-medium text-[#23B349] text-[16px] mb-4 tracking-tight";

const linkClass =
  "font-['Outfit'] text-white/90 text-[12px] leading-tight hover:text-[#90D152] transition-colors duration-300";

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="mb-8 flex flex-col">
      <h4 className={headingClass}>{title}</h4>

      <nav className="flex flex-col gap-2.5">
        {links.map(({ label, href }, index) => (
          <Link
            key={`${href}-${index}`}
            href={href}
            className={linkClass}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  const { settings } = useSettings();
  const locale = useLocale();

  const [products, setProducts] = useState<
    Array<{
      _id: string;
      slug: string;
      name: {
        en: string;
        am: string;
      };
      category: "Biscuit" | "Flour";
      available?: boolean;
    }>
  >([]);

  useEffect(() => {
    api
      .get<
        Array<{
          _id: string;
          slug: string;
          name: {
            en: string;
            am: string;
          };
          category: "Biscuit" | "Flour";
          available?: boolean;
        }>
      >("/products")
      .then((response) => {
        const items = Array.isArray(response.data)
          ? response.data.filter((product) => product.available !== false)
          : [];

        setProducts(items);
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const [biscuitLinks, flourLinks] = useMemo(() => {
    const biscuits = products
      .filter((product) => product.category === "Biscuit")
      .map((product) => ({
        label:
          locale === "am"
            ? product.name.am || product.name.en
            : product.name.en,
        href: `/products/${product.slug}`,
      }));

    const flour = products
      .filter((product) => product.category === "Flour")
      .map((product) => ({
        label:
          locale === "am"
            ? product.name.am || product.name.en
            : product.name.en,
        href: `/products/${product.slug}`,
      }));

    return [biscuits, flour];
  }, [locale, products]);

  const socialLinks = [
    {
      icon: FacebookIcon,
      href: settings?.socialLinks?.facebook,
      label: "Facebook",
    },
    {
      icon: TwitterIcon,
      href: settings?.socialLinks?.twitter,
      label: "Twitter",
    },
    {
      icon: InstagramIcon,
      href: settings?.socialLinks?.instagram,
      label: "Instagram",
    },
    {
      icon: YoutubeIcon,
      href: settings?.socialLinks?.youtube,
      label: "YouTube",
    },
    {
      icon: TikTokIcon,
      href: settings?.socialLinks?.tiktok,
      label: "TikTok",
    },
  ];

  const footerLinks = {
    biscuits: biscuitLinks,
    flour: flourLinks,

    company: [
      {
        label: "Investors",
        href: "/about#investors",
      },
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Why Choose Us",
        href: "/why-choose-vita",
      },
    ],

    peoplePlanet: [
      {
        label: "Experiences",
        href: "/people-planet#experiences",
      },
      {
        label: "Sustainability",
        href: "/sustainability",
      },
      {
        label: "Community",
        href: "/people-planet#community",
      },
      {
        label: "Innovation",
        href: "/innovation",
      },
      {
        label: "We Care for All®",
        href: "/we-care",
      },
    ],

    resources: [
      {
        label: "Research",
        href: "/research",
      },
      {
        label: "Media Kit",
        href: "#",
      },
      {
        label: "FAQs",
        href: "/faqs",
      },
    ],

    whatsNew: [
      {
        label: "News & Articles",
        href: "/news",
      },
      {
        label: "Updates",
        href: "/news",
      },
    ],
  };

  return (
    <footer className="relative flex w-full flex-col bg-white pt-0">
      {/* CTA section */}
      <div className="relative z-0 w-full bg-white px-4 pb-24 sm:px-8 lg:px-[120px]">
        <div className="pointer-events-auto mx-auto w-full max-w-[1260px]">
          {/* Green CTA Block */}
          <div className="relative mt-6 flex min-h-[300px] w-full flex-col items-center justify-between overflow-visible rounded-[30px] bg-[#82D942] p-8 md:mt-10 md:flex-row md:p-12 lg:min-h-[360px] lg:p-16">
            {/* Left Content */}
            <div className="relative z-30 flex max-w-full flex-col items-start text-left md:max-w-[55%]">
              <h2 className="mb-4 font-['Outfit'] text-[32px] font-black leading-none tracking-tight text-[#2D2D2D] sm:text-[40px] md:text-[48px] lg:text-[58px]">
                Let&apos;s Work Together
              </h2>

              <p className="mb-8 max-w-[480px] font-['Outfit'] text-[14px] font-normal leading-snug text-[#3A3A3A] md:text-[16px] lg:text-[18px]">
                Question, business inquiry, or partnership idea?
                <br />
                Our team is ready to connect and support you
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-['Outfit'] text-[14px] font-bold text-[#23B349] shadow-[0px_8px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-105 md:text-[16px]"
              >
                Connect with us &rarr;
              </Link>
            </div>

            {/* Elephant Graphic */}
            <div className="pointer-events-none relative bottom-[-20px] z-10 mt-6 h-[240px] w-full max-w-[280px] sm:h-[300px] sm:max-w-[340px] md:absolute md:bottom-[-45px] md:right-[20px] md:mt-0 md:h-[135%] md:w-[380px] md:max-w-none lg:bottom-[-60px] lg:right-[40px] lg:h-[145%] lg:w-[460px] xl:w-[500px]">
              <div className="relative h-full w-full">
                <Image
                  src="/assets/hero/elephant-safari.png"
                  alt="Elephant and Rabbit Safari"
                  fill
                  loading="lazy"
                  decoding="async"
                  quality={85}
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 380px, (max-width: 1280px) 460px, 500px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/*
              White masking layer.

              It begins exactly after the green card and sits above
              the overflowing elephant image.
            */}
            <div className="pointer-events-none absolute left-[-200px] right-[-200px] top-full z-20 h-[130px] bg-white md:h-[150px] lg:h-[170px]" />
          </div>
        </div>
      </div>

      {/* Dark footer section */}
      <div className="relative flex flex-col items-center bg-[#404040] pb-0 pt-24 mt-16 md:mt-24">
        {/* Dark top curve */}
        <div className="pointer-events-none absolute left-0 right-0 top-[-79px] z-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative block h-[80px] w-full text-[#404040]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 C 360 65, 1080 65, 1440 0 L 1440 80 L 0 80 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/*
          Only this white newsletter card is brought above
          the CTA and elephant using a high z-index.
        */}
        <div className="pointer-events-auto absolute left-0 right-0 top-[-79px] z-[100] -translate-y-[40%] px-4 sm:px-8 lg:px-[120px]">
          <div className="mx-auto flex w-full max-w-[1260px] flex-col items-center justify-between gap-6 rounded-[24px] bg-white p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.06)] md:p-8 lg:flex-row">
            <h3 className="font-['Outfit'] text-[28px] font-black tracking-tight text-[#23B349] lg:text-[46px] xl:text-[54px]">
              Get the Latest News &amp; Updates...
            </h3>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <input
                type="email"
                placeholder="Email Address"
                className="h-[52px] w-full rounded-full border border-gray-300 px-6 text-[15px] text-[#404040] outline-none shadow-[0px_4px_12px_rgba(0,0,0,0.02)] md:w-[320px] lg:w-[380px]"
              />

              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#23B349] text-white shadow-[0px_4px_12px_rgba(35,179,73,0.2)] transition-all duration-300 hover:scale-105"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-10 flex w-full max-w-[1400px] flex-col gap-16 px-4 pb-4 pt-10 sm:px-8 lg:flex-row lg:gap-32 lg:px-20">
          {/* Contact column */}
          <div className="flex flex-col gap-6 lg:w-[350px]">
            <Image
              src="/assets/footer/vita-logo-white.svg"
              alt="Vita Food Complex"
              width={160}
              height={80}
              className="h-auto w-auto object-contain"
            />

            <div className="font-['Outfit'] text-[13px] font-light leading-[1.8] text-white">
              <p>+251 911 123 456</p>
              <p>info@vitafoodcomplex.com</p>

              <br />

              <p>Lideta SC, Woreda 02</p>
              <p>Addis Ababa, AA, Ethiopia</p>
            </div>

            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <a
                    key={`${social.label}-${index}`}
                    href={social.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-[#23B349] hover:bg-[#23B349]"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-0 md:grid-cols-3">
            <div>
              <FooterColumn
                title="Biscuits"
                links={footerLinks.biscuits}
              />
            </div>

            <div>
              <FooterColumn
                title="Flour"
                links={footerLinks.flour}
              />

              <FooterColumn
                title="People & Planet"
                links={footerLinks.peoplePlanet}
              />
            </div>

            <div>
              <FooterColumn
                title="Company"
                links={footerLinks.company}
              />

              <FooterColumn
                title="Resources"
                links={footerLinks.resources}
              />

              <FooterColumn
                title="What's New"
                links={footerLinks.whatsNew}
              />
            </div>
          </div>
        </div>

        {/* Giant Vita Background Logo */}
        {/* Giant Vita Background Logo */}
        <div className="pointer-events-none relative z-0 -mb-42 w-full overflow-hidden px-0 lg:-mb-28">          <Image
            src="/assets/footer/vita-footer.png"
            alt="Vita Background Logo"
            width={1920}
            height={800}
            className="relative z-0 h-auto w-full object-contain"
          />
        </div>

        {/* Footer Bottom */}
        <div className="relative z-20 -mt-8 flex w-full flex-col items-center overflow-x-clip lg:-mt-[110px]">
          {/* Wave — above the Vita logo */}
          <div
            className="relative z-20 h-[171.02px] w-[2270.59px] shrink-0 translate-x-[15.4px] bg-[url('/assets/footer/footer-wave-bg.png')] bg-[length:100%_100%] bg-center bg-no-repeat"
            style={{
              filter: "drop-shadow(0px -14px 47px rgba(0, 71, 21, 0.2))",
            }}
          />

          {/* White Bottom Strip — always above the Vita logo and wave */}
          <div className="relative z-30 -mt-1 w-full bg-white">
            <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-0 lg:px-20">
              {/* Divider */}
              <div className="mb-4 h-[1px] w-full bg-[#23B349]" />

              {/* Links and copyright */}
              <div className="flex flex-col items-center justify-between font-['Outfit'] text-[11px] font-light text-[#404040] md:flex-row lg:text-[12px]">
                <div className="mb-4 flex flex-wrap justify-center gap-6 md:mb-0 md:justify-start lg:gap-10">
                  <Link
                    href="#"
                    className="transition-colors hover:text-[#23B349]"
                  >
                    Terms and Conditions
                  </Link>

                  <Link
                    href="#"
                    className="transition-colors hover:text-[#23B349]"
                  >
                    Privacy Policy
                  </Link>

                  <Link
                    href="#"
                    className="transition-colors hover:text-[#23B349]"
                  >
                    Legal Notice
                  </Link>
                </div>

                <p>
                  © {new Date().getFullYear()} Vita Food Complex. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
