"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@frontend/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Globe, X, Menu, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface NavNewsItem {
  _id: string;
  slug: string;
  title: { en: string; am: string };
  coverImage: string;
  publishedAt: string;
  category: string;
}

interface NavProductItem {
  _id: string;
  slug: string;
  name: { en: string; am: string };
  category: "Biscuit" | "Flour";
  available?: boolean;
}

type NavKey =
  | "products"
  | "company"
  | "people-planet"
  | "resources"
  | "whats-new";

const navLinks: { key: NavKey; href: string; hasDropdown?: boolean }[] = [
  { key: "products", href: "/products", hasDropdown: true },
  { key: "company", href: "/about", hasDropdown: true },
  { key: "people-planet", href: "/people-planet", hasDropdown: true },
  { key: "resources", href: "/research", hasDropdown: true },
  { key: "whats-new", href: "/news", hasDropdown: true },
];

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavKey | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // What's New — live data
  const [latestNews, setLatestNews] = useState<NavNewsItem[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<NavNewsItem[]>([]);
  const [newsLoaded, setNewsLoaded] = useState(false);
  const [menuProducts, setMenuProducts] = useState<NavProductItem[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__pageLoaded) {
      setPageLoaded(true);
      return;
    }
    const handlePageLoaded = () => setPageLoaded(true);
    document.addEventListener("page-loaded", handlePageLoaded);
    return () => document.removeEventListener("page-loaded", handlePageLoaded);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch news once when the What's New dropdown is first opened
  useEffect(() => {
    if (activeDropdown === "whats-new" && !newsLoaded) {
      api
        .get<NavNewsItem[]>("/news")
        .then((res) => {
          const all = res.data;
          setLatestNews(all.slice(0, 2));
          setRecentUpdates(
            all
              .filter(
                (n) =>
                  n.category === "updates" || n.category === "company-news",
              )
              .slice(0, 3),
          );
          setNewsLoaded(true);
        })
        .catch(() => setNewsLoaded(true));
    }
  }, [activeDropdown, newsLoaded]);

  useEffect(() => {
    if (activeDropdown !== "products" || productsLoaded) return;
    api
      .get<NavProductItem[]>("/products")
      .then((res) => {
        const items = Array.isArray(res.data)
          ? res.data.filter((p) => p.available !== false)
          : [];
        setMenuProducts(items);
      })
      .finally(() => setProductsLoaded(true));
  }, [activeDropdown, productsLoaded]);

  const toggleDropdown = (key: NavKey) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const locale = useLocale();
  const searchParams = useSearchParams();
  const isAm = locale === "am";
  const biscuitProducts = useMemo(
    () => menuProducts.filter((p) => p.category === "Biscuit"),
    [menuProducts],
  );
  const flourProducts = useMemo(
    () => menuProducts.filter((p) => p.category === "Flour"),
    [menuProducts],
  );

  // Language switcher function
  const switchLanguage = (newLocale: "en" | "am") => {
    if (newLocale !== locale) {
      const search = searchParams.toString();
      const href = search ? `${pathname}?${search}` : pathname;
      router.replace(href, { locale: newLocale });
    }
    setLangDropdownOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-999 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
    >
      <div className="w-full max-w-[1664px] relative">
        {/* Main bar - entrance animation: starts small width, centered, then drops/expands into place */}
        <motion.div
          initial={{ scaleX: 0.05, opacity: 0, y: -40 }}
          animate={pageLoaded ? { scaleX: 1, opacity: 1, y: 0 } : { scaleX: 0.05, opacity: 0, y: -40 }}
          transition={{
            type: "spring",
            stiffness: 85,
            damping: 14,
            mass: 0.9,
            delay: 0.15,
          }}
          style={{
            background:
              "radial-gradient(ellipse at 25.041px 143.28px, rgba(31,214,80,1) 0%, rgba(35,179,73,1) 60%, rgba(75,217,64,1) 80%, rgba(116,255,56,1) 100%)",
            transformOrigin: "top center",
          }}
          className="w-full pl-[12px] sm:pl-[24px] lg:pl-[28px] xl:pl-[48px] pr-[12px] sm:pr-[16px] lg:pr-[20px] xl:pr-[32px] py-[8px] sm:py-[12px] rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] flex items-center shadow-lg relative z-50"
        >
          <div className="flex gap-[16px] sm:gap-[24px] lg:gap-[28px] xl:gap-[64px] items-center flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative">
                <div className="w-[60px] h-[28px] sm:w-[80px] sm:h-[38px] lg:w-[92px] lg:h-[43px] xl:w-[102.56px] xl:h-[48.406px] relative">
                  <Image
                    src="/assets/brand/vita-logo.svg"
                    alt="Vita Food Complex"
                    fill
                    unoptimized
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 640px) 60px, (max-width: 1024px) 80px, (max-width: 1280px) 92px, 103px"
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-[14px] xl:gap-[24px] 2xl:gap-[48px]">
              {navLinks.map((link) => (
                <div
                  key={link.key}
                  className={`flex gap-[3px] items-center justify-center cursor-pointer transition-all duration-300 rounded-[999px] ${
                    activeDropdown === link.key
                      ? "bg-white px-3 py-1.5 xl:px-4 xl:py-2"
                      : "hover:opacity-80"
                  }`}
                  onClick={(e: ReactMouseEvent<HTMLDivElement>) => {
                    if (link.hasDropdown) {
                      e.preventDefault();
                      toggleDropdown(link.key);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    className={`text-[13px] xl:text-[16px] 2xl:text-[20px] font-['Funnel_Display'] font-medium leading-normal tracking-[-0.08px] whitespace-nowrap ${
                      activeDropdown === link.key
                        ? "text-[#23B349]"
                        : "text-white"
                    }`}
                    onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
                      if (link.hasDropdown) e.preventDefault();
                    }}
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                  {link.hasDropdown && (
                    <div className="flex items-center justify-center">
                      <ChevronDown
                        className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                          activeDropdown === link.key
                            ? "text-[#23B349] rotate-180"
                            : "text-white opacity-80"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Language switcher and CTA */}
          <div className="flex gap-[8px] sm:gap-[12px] lg:gap-[14px] xl:gap-[24px] items-center">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-[24px] sm:h-[28px] lg:h-[29px] xl:h-[31px] rounded-[12px] lg:rounded-[14px] xl:rounded-[15.55px] px-[8px] sm:px-[12px] xl:px-[16px] bg-black border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-900 transition-colors"
                aria-label={`Switch language. Current: ${locale === "en" ? "English" : "Amharic"}`}
                aria-expanded={langDropdownOpen}
              >
                <Globe
                  size={13}
                  strokeWidth={1.5}
                  className="text-white shrink-0"
                />
                <span className="text-white text-[10px] sm:text-[11px] font-bold leading-none uppercase">
                  {locale === "en" ? "EN" : "AM"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-white transition-transform duration-300 ml-0.5 ${langDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[140px] bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 flex flex-col p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] transition-colors w-full text-left ${locale === "en" ? "bg-[#23B349]/10 text-[#23B349]" : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    <span className="font-['Outfit'] text-[14px] font-medium">English</span>
                    <span className="text-[16px] leading-none">🇬🇧</span>
                  </button>
                  <button
                    onClick={() => switchLanguage("am")}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] transition-colors w-full text-left mt-1 ${locale === "am" ? "bg-[#23B349]/10 text-[#23B349]" : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    <span className="font-['Outfit'] text-[14px] font-medium">አማርኛ</span>
                    <span className="text-[16px] leading-none">🇪🇹</span>
                  </button>
                </div>
              )}
            </div>

            {/* CTA — hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="border border-white px-[10px] lg:px-[18px] xl:px-[24px] py-[7px] lg:py-[5px] xl:py-[10px] rounded-[99px] flex items-center justify-center gap-[8px] hover:bg-white hover:text-[#23B349] transition-all duration-300 group"
              >
                <span className="text-black group-hover:text-[#23B349] text-[13px] xl:text-[15px] 2xl:text-[24px] font-['Funnel_Display'] font-medium leading-normal tracking-[-0.096px] whitespace-nowrap">
                  {t("cta")}
                </span>
              </Link>
            </div>

            {/* Hamburger — visible only on mobile/tablet (< lg) */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {mobileOpen ? (
                <X size={24} strokeWidth={2.5} />
              ) : (
                <Menu size={24} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </motion.div>

        {/* Mobile / tablet dropdown — hidden on lg+ where desktop nav is shown */}
        {mobileOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 w-full bg-[#23B349] rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col lg:hidden overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col p-2">
              {navLinks.map((link) => (
                <div key={link.key}>
                  <button
                    onClick={() => {
                      if (link.hasDropdown) {
                        toggleDropdown(link.key);
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                    className={`w-full px-6 py-4 text-[18px] sm:text-[20px] font-['Funnel_Display'] font-medium rounded-[16px] transition-colors flex justify-between items-center text-left ${
                      activeDropdown === link.key
                        ? "bg-white text-[#23B349]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {t(`links.${link.key}`)}
                    {link.hasDropdown && (
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                          activeDropdown === link.key
                            ? "text-[#23B349] rotate-180"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>

                  {/* Expanded sub-menu for each dropdown */}
                  {link.hasDropdown && activeDropdown === link.key && (
                    <div className="mx-2 mb-2 bg-black/10 rounded-[16px] overflow-hidden">
                      {link.key === "products" && (
                        <div className="flex flex-col">
                          {[
                            {
                              label: t("dropdowns.products.biscuits.label"),
                              href: "/products?category=biscuit",
                              desc: t("dropdowns.products.biscuits.desc"),
                            },
                            {
                              label: t("dropdowns.products.flour.label"),
                              href: "/products?category=flour",
                              desc: t("dropdowns.products.flour.desc"),
                            },
                            {
                              label: t("dropdowns.products.recipes.label"),
                              href: "/recipes",
                              desc: t("dropdowns.products.recipes.desc"),
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                                {item.label}
                              </span>
                              <span className="text-white/70 text-[12px] mt-0.5">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="px-6 py-3 text-white/90 font-['Funnel_Display'] font-semibold text-[14px] flex items-center gap-2 hover:bg-white/10 transition-colors"
                          >
                            {t("dropdowns.products.viewAll")}{" "}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          {menuProducts.slice(0, 6).map((product) => (
                            <Link
                              key={product._id}
                              href={`/products/${product.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col border-t border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[14px] line-clamp-1">
                                {isAm
                                  ? product.name.am || product.name.en
                                  : product.name.en}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {link.key === "company" && (
                        <div className="flex flex-col">
                          {[
                            {
                              label: t("dropdowns.company.about.label"),
                              href: "/about",
                              desc: t("dropdowns.company.about.desc"),
                            },
                            {
                              label: t("dropdowns.company.whyChoose.label"),
                              href: "/why-choose-vita",
                              desc: t("dropdowns.company.whyChoose.desc"),
                            },
                            {
                              label: t("dropdowns.company.careers.label"),
                              href: "/careers",
                              desc: t("dropdowns.company.careers.desc"),
                            },
                            {
                              label: t(
                                "dropdowns.company.sustainability.label",
                              ),
                              href: "/sustainability",
                              desc: t("dropdowns.company.sustainability.desc"),
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                                {item.label}
                              </span>
                              <span className="text-white/70 text-[12px] mt-0.5">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {link.key === "people-planet" && (
                        <div className="flex flex-col">
                          {[
                            {
                              label: t(
                                "dropdowns.peoplePlanet.community.label",
                              ),
                              href: "/people-planet",
                              desc: t("dropdowns.peoplePlanet.community.desc"),
                            },
                            {
                              label: t(
                                "dropdowns.peoplePlanet.innovation.label",
                              ),
                              href: "/innovation",
                              desc: t("dropdowns.peoplePlanet.innovation.desc"),
                            },
                            {
                              label: t("dropdowns.peoplePlanet.weCare.label"),
                              href: "/we-care",
                              desc: t("dropdowns.peoplePlanet.weCare.desc"),
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                                {item.label}
                              </span>
                              <span className="text-white/70 text-[12px] mt-0.5">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {link.key === "resources" && (
                        <div className="flex flex-col">
                          {[
                            {
                              label: t("dropdowns.resources.distributor.label"),
                              href: "/become-distributor",
                              desc: t("dropdowns.resources.distributor.desc"),
                            },
                            {
                              label: t("dropdowns.resources.research.label"),
                              href: "/research",
                              desc: t("dropdowns.resources.research.desc"),
                            },
                            {
                              label: t("dropdowns.resources.faqs.label"),
                              href: "/faqs",
                              desc: t("dropdowns.resources.faqs.desc"),
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                                {item.label}
                              </span>
                              <span className="text-white/70 text-[12px] mt-0.5">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {link.key === "whats-new" && (
                        <div className="flex flex-col">
                          <Link
                            href="/news"
                            onClick={() => setMobileOpen(false)}
                            className="px-6 py-3 flex flex-col border-b border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                              {t("dropdowns.whatsNew.news.label")}
                            </span>
                            <span className="text-white/70 text-[12px] mt-0.5">
                              {t("dropdowns.whatsNew.news.desc")}
                            </span>
                          </Link>
                          {latestNews.slice(0, 3).map((article) => {
                            const title =
                              article.title[locale as "en" | "am"] ||
                              article.title.en;
                            return (
                              <Link
                                key={article._id}
                                href={`/news/${article.slug}` as any}
                                onClick={() => setMobileOpen(false)}
                                className="px-6 py-3 flex flex-col border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                              >
                                <span className="text-white font-['Funnel_Display'] font-semibold text-[14px] line-clamp-1">
                                  {title}
                                </span>
                              </Link>
                            );
                          })}
                          {latestNews.length === 0 && (
                            <Link
                              href="/news"
                              onClick={() => setMobileOpen(false)}
                              className="px-6 py-3 flex flex-col last:border-0 hover:bg-white/10 transition-colors"
                            >
                              <span className="text-white font-['Funnel_Display'] font-semibold text-[15px]">
                                {t("dropdowns.whatsNew.updates.label")}
                              </span>
                              <span className="text-white/70 text-[12px] mt-0.5">
                                {t("dropdowns.whatsNew.updates.desc")}
                              </span>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Language switcher in mobile menu */}
            <div className="px-6 py-4 border-t border-white/20 bg-black/5">
              <div className="space-y-4">
                <div className="text-white/80 text-[14px] font-['Funnel_Display'] font-semibold uppercase tracking-wider">
                  {t("mobile.selectLanguage")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* English option */}
                  <Link
                    href={pathname}
                    locale="en"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] transition-all ${
                      locale === "en"
                        ? "bg-white text-[#23B349] shadow-md"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="text-[14px] font-bold">UK|EN</span>
                  </Link>

                  {/* Amharic option */}
                  <Link
                    href={pathname}
                    locale="am"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] transition-all ${
                      locale === "am"
                        ? "bg-white text-[#23B349] shadow-md"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="text-[14px] font-bold">ET|AM</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/10">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center text-[#23B349] bg-white text-[18px] sm:text-[20px] font-['Funnel_Display'] font-bold py-4 rounded-[16px] shadow-lg active:scale-[0.98] transition-all"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        )}

        {/* Mega Menu Dropdown — desktop + laptop (lg+) */}
        <div
          className={`w-full bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden absolute top-[calc(100%+0.5rem)] left-0 z-40 ${
            activeDropdown && !mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="py-6 xl:py-10 px-6 xl:pl-[48px] xl:pr-[32px]">
            {/* ── Products ── */}
            {activeDropdown === "products" && (
              <div className="flex flex-col xl:flex-row justify-between gap-8 xl:gap-[64px] w-full">
                {/* Categories */}
                <div className="flex flex-col gap-4 xl:gap-6 w-full xl:w-[436px]">
                  <div className="flex flex-col gap-2 xl:gap-2">
                    {[
                      {
                        label: t("dropdowns.products.biscuits.label"),
                        desc: t("dropdowns.products.biscuits.desc"),
                        href: "/products?category=biscuit",
                        img: "/assets/products/figma/figma_prod_12.png",
                      },
                      {
                        label: t("dropdowns.products.flour.label"),
                        desc: t("dropdowns.products.flour.desc"),
                        href: "/products?category=flour",
                        img: "/assets/products/figma/figma_prod_12.png",
                      },
                      {
                        label: t("dropdowns.products.recipes.label"),
                        desc: t("dropdowns.products.recipes.desc"),
                        href: "/recipes",
                        img: "/assets/products/figma/figma_prod_12.png",
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex flex-row justify-between items-center rounded-[16px] transition-all duration-300 xl:w-[436px] xl:h-[87px] bg-[#F3F3F3] hover:bg-white border box-border border-transparent hover:border-[#23B349] overflow-hidden group"
                      >
                        <div className="flex flex-col justify-center py-[20px] px-[24px]">
                          <h3 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                            {item.label}
                          </h3>
                          <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em] mt-1">
                            {item.desc}
                          </p>
                        </div>
                        <div className={`w-[105px] h-[87px] relative shrink-0`}>
                          <Image
                            src={item.img}
                            alt={item.label}
                            fill
                            className="object-cover"
                            sizes="105px"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center justify-center gap-4 bg-[#23B349] hover:bg-[#1A1A1A] text-white px-[32px] py-[16px] rounded-[999px] font-['Outfit'] text-[14px] xl:text-[20px] font-medium transition-colors w-fit self-start xl:h-[56px] group whitespace-nowrap"
                  >
                    {t("dropdowns.products.viewAll")} Products{" "}
                    <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Product name lists — hidden at lg, shown at xl */}
                <div className="hidden xl:flex gap-6 w-[384px] h-[208px]">
                  <ul className="flex flex-col gap-4 w-[180px] opacity-80">
                    {biscuitProducts.slice(0, 7).map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="text-[#404040] hover:text-[#23B349] font-['Outfit'] text-[16px] font-medium transition-colors tracking-[-0.004em]"
                        >
                          {isAm
                            ? product.name.am || product.name.en
                            : product.name.en}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-col gap-4 w-[180px] opacity-80">
                    {biscuitProducts
                      .slice(7, 14)
                      .concat(flourProducts.slice(0, 7))
                      .map((product) => (
                        <li key={product._id}>
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="text-[#404040] hover:text-[#23B349] font-['Outfit'] text-[16px] font-medium transition-colors tracking-[-0.004em]"
                          >
                            {isAm
                              ? product.name.am || product.name.en
                              : product.name.en}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Featured card — hidden at lg, shown at xl */}
                <div className="hidden xl:flex flex-col bg-[#F3F3F3] p-2 gap-2 rounded-[16px] w-[287px] h-[260px]">
                  <Link
                    href={
                      menuProducts[0]
                        ? `/products/${menuProducts[0].slug}`
                        : "/products"
                    }
                    onClick={() => setActiveDropdown(null)}
                    className="group block h-full"
                  >
                    <div className="w-[271px] h-[185px] relative rounded-[8px] overflow-hidden mb-2">
                      <Image
                        src="/assets/products/figma/figma_prod_12.png"
                        alt="Sina Biscuit"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="271px"
                      />
                    </div>
                    <div className="flex flex-col px-2">
                      <h4 className="text-[#404040] font-['Outfit'] text-[16px] font-medium group-hover:text-[#23B349] transition-colors leading-[16px] flex items-center gap-1">
                        {t("dropdowns.products.specialEdition")}—{" "}
                        <span className="font-['Funnel_Display'] text-[20px] font-medium">
                          {menuProducts[0]
                            ? isAm
                              ? menuProducts[0].name.am ||
                                menuProducts[0].name.en
                              : menuProducts[0].name.en
                            : "Sina Biscuit"}
                        </span>
                      </h4>
                      <p className="text-[#404040] text-[14px] font-['Outfit'] mt-1 leading-[14px]">
                        {t("dropdowns.products.latestUpdates")}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* ── People & Planet ── */}
            {activeDropdown === "people-planet" && (
              <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 w-full xl:justify-between">
                {/* Image card — hidden at lg */}
                <div className="hidden xl:flex w-[340px] min-h-[260px] rounded-[24px] p-6 flex-col justify-between relative overflow-hidden group shadow-sm shrink-0">
                  <Image
                    src="https://picsum.photos/400/300?random=55"
                    fill
                    sizes="340px"
                    className="object-cover"
                    alt="Experiences"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
                  <div className="z-10 relative">
                    <h3 className="font-['Funnel_Display'] text-[24px] font-bold text-[#1A1A1A]">
                      {t("dropdowns.peoplePlanet.experiences")}
                    </h3>
                    <p className="text-gray-600 text-[14px] mt-1 font-medium">
                      {t("dropdowns.peoplePlanet.communityInitiatives")}
                    </p>
                  </div>
                  <Link
                    href="/gallery"
                    onClick={() => setActiveDropdown(null)}
                    className="bg-[#23B349] hover:bg-[#1A1A1A] transition-colors text-white px-6 py-2.5 rounded-full font-medium self-start z-10 flex items-center gap-2 mt-auto"
                  >
                    {t("dropdowns.peoplePlanet.seeAll")}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Links — two columns on lg, stacked single on smaller */}
                <div className="flex flex-row xl:contents gap-12">
                  <div className="flex flex-col gap-6 xl:gap-8 py-2 xl:w-auto">
                    {[
                      {
                        label: t("dropdowns.peoplePlanet.community.label"),
                        desc: t("dropdowns.peoplePlanet.community.desc"),
                        href: "/people-planet",
                      },
                      {
                        label: t("dropdowns.peoplePlanet.innovation.label"),
                        desc: t("dropdowns.peoplePlanet.innovation.desc"),
                        href: "/innovation",
                      },
                      {
                        label: t("dropdowns.peoplePlanet.weCare.label"),
                        desc: t("dropdowns.peoplePlanet.weCare.desc"),
                        href: "/we-care",
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border border-transparent hover:border-[#23B349]"
                      >
                        <h4 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                          {item.label}
                        </h4>
                        <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6 xl:gap-8 py-2 xl:w-auto">
                    <Link
                      href="/terms"
                      onClick={() => setActiveDropdown(null)}
                      className="flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border border-transparent hover:border-[#23B349]"
                    >
                      <h4 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                        {t("dropdowns.peoplePlanet.terms.label")}
                      </h4>
                      <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                        {t("dropdowns.peoplePlanet.terms.desc")}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── Company ── */}
            {activeDropdown === "company" && (
              <div className="flex flex-col xl:flex-row gap-6 xl:gap-[64px] w-full xl:justify-center">
                {[
                  {
                    title: t("dropdowns.company.about.label"),
                    desc: t("dropdowns.company.about.desc"),
                    href: "/about",
                    active: true,
                  },
                  {
                    title: t("dropdowns.company.whyChoose.label"),
                    desc: t("dropdowns.company.whyChoose.desc"),
                    href: "/why-choose-vita",
                  },
                  {
                    title: t("dropdowns.company.careers.label"),
                    desc: t("dropdowns.company.careers.desc"),
                    href: "/careers",
                  },
                  {
                    title: t("dropdowns.company.sustainability.label"),
                    desc: t("dropdowns.company.sustainability.desc"),
                    href: "/sustainability",
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className={`flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border ${item.active ? "border-[#23B349]" : "border-transparent hover:border-[#23B349]"}`}
                  >
                    <h3 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                      {item.title}
                    </h3>
                    <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* ── Resources ── */}
            {activeDropdown === "resources" && (
              <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 w-full xl:justify-between">
                {/* Column 1: Primary links */}
                <div className="flex flex-col gap-6 xl:gap-8 xl:w-auto">
                  {[
                    {
                      label: t("dropdowns.resources.distributor.label"),
                      desc: t("dropdowns.resources.distributor.desc"),
                      href: "/become-distributor",
                    },
                    {
                      label: t("dropdowns.resources.customerCare.label"),
                      desc: t("dropdowns.resources.customerCare.desc"),
                      href: "/contact-customer-care",
                    },
                    {
                      label: t("dropdowns.resources.research.label"),
                      desc: t("dropdowns.resources.research.desc"),
                      href: "/research",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border border-transparent hover:border-[#23B349]"
                    >
                      <h4 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                        {item.label}
                      </h4>
                      <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Column 2: FAQs */}
                <div className="flex flex-col gap-6 xl:gap-8 xl:w-auto">
                  {[
                    {
                      label: t("dropdowns.resources.faqs.label"),
                      desc: t("dropdowns.resources.faqs.desc"),
                      href: "/faqs",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border border-transparent hover:border-[#23B349]"
                    >
                      <h4 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                        {item.label}
                      </h4>
                      <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Quick links — hidden at lg */}
                <div className="hidden xl:flex flex-col gap-3 xl:w-[280px]">
                  <h4 className="font-['Funnel_Display'] text-[16px] font-bold text-[#1A1A1A] mb-2">
                    {t("dropdowns.resources.more")}
                  </h4>
                  {[
                    {
                      label: `${t("dropdowns.resources.explore")} ${t("dropdowns.products.biscuits.label")}`,
                      href: "/products?category=biscuit",
                    },
                    {
                      label: `${t("dropdowns.resources.explore")} ${t("dropdowns.products.flour.label")}`,
                      href: "/products?category=flour",
                    },
                    {
                      label: `${t("dropdowns.resources.explore")} ${t("dropdowns.products.recipes.label")}`,
                      href: "/recipes",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="bg-[#F5F5F5] rounded-[12px] px-5 py-3.5 flex items-center hover:bg-gray-200 transition-colors group"
                    >
                      <span className="text-[14px] text-[#1A1A1A] font-medium group-hover:text-[#23B349] transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* CTA card — hidden at lg */}
                <div className="hidden xl:block xl:w-[340px]">
                  <Link
                    href="https://vita.blihmarketing.com/"
                    target="_blank"
                    onClick={() => setActiveDropdown(null)}
                    className="rounded-[16px] p-6 flex flex-col justify-center relative overflow-hidden group min-h-[120px] shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(31,214,80,1) 0%, rgba(116,255,56,1) 100%)",
                    }}
                  >
                    <div className="absolute top-4 right-4 bg-white w-8 h-8 rounded-md flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowRight
                        className="w-4 h-4 text-[#FF8A00] -rotate-45"
                        strokeWidth={3}
                      />
                    </div>
                    <h4 className="font-['Funnel_Display'] text-[24px] font-bold z-10 relative text-white">
                      {t("dropdowns.resources.creativeLibrary")}
                    </h4>
                    <p className="text-white text-[14px] z-10 relative mt-1 font-medium">
                      {t("dropdowns.resources.distributor.desc")}
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {/* ── What's New ── */}
            {activeDropdown === "whats-new" && (
              <div className="flex flex-col xl:flex-row gap-8 w-full xl:justify-between">
                {/* Primary links */}
                <div className="flex flex-col gap-6 xl:gap-8 xl:w-auto">
                  {[
                    {
                      label: t("dropdowns.whatsNew.news.label"),
                      desc: t("dropdowns.whatsNew.news.desc"),
                      href: "/news",
                    },
                    {
                      label: t("dropdowns.whatsNew.updates.label"),
                      desc: t("dropdowns.whatsNew.updates.desc"),
                      href: "/news",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex flex-col justify-center px-6 py-5 rounded-[16px] transition-all duration-300 xl:w-[334px] xl:h-[87px] gap-2 border box-border border-transparent hover:border-[#23B349]"
                    >
                      <h4 className="text-[#404040] font-['Funnel_Display'] text-[16px] xl:text-[20px] font-medium leading-[25px] tracking-[-0.004em]">
                        {item.label}
                      </h4>
                      <p className="text-[#404040] font-['Outfit'] text-[12px] xl:text-[14px] leading-tight tracking-[-0.004em]">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Latest News cards — hidden at lg */}
                <div className="hidden xl:flex flex-col gap-4 xl:w-[340px]">
                  <h4 className="font-['Funnel_Display'] text-[16px] font-bold text-[#1A1A1A] mb-2">
                    {t("dropdowns.whatsNew.latestNews")}
                  </h4>
                  {!newsLoaded ? (
                    // Skeleton while loading
                    [1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-[#F5F5F5] rounded-[16px] p-2 animate-pulse"
                      >
                        <div className="w-full h-[110px] bg-gray-200 rounded-[12px]" />
                        <div className="h-4 bg-gray-200 rounded mt-3 mx-2 mb-2 w-3/4" />
                      </div>
                    ))
                  ) : latestNews.length > 0 ? (
                    latestNews.map((article) => {
                      const daysAgo = Math.max(
                        0,
                        Math.floor(
                          (Date.now() -
                            new Date(article.publishedAt).getTime()) /
                            86400000,
                        ),
                      );
                      const title =
                        article.title[locale as "en" | "am"] ||
                        article.title.en;
                      return (
                        <Link
                          key={article._id}
                          href={`/news/${article.slug}` as any}
                          onClick={() => setActiveDropdown(null)}
                          className="bg-[#F5F5F5] rounded-[16px] p-2 flex flex-col gap-3 group hover:bg-[#EBEBEB] transition-colors"
                        >
                          <div className="w-full h-[110px] relative rounded-[12px] overflow-hidden shrink-0 bg-gray-200">
                            {article.coverImage && (
                              <Image
                                src={article.coverImage}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={title}
                                sizes="280px"
                              />
                            )}
                          </div>
                          <div className="flex justify-between items-start gap-2 px-2 pb-1">
                            <h5 className="font-['Funnel_Display'] text-[14px] font-bold text-[#1A1A1A] group-hover:text-[#23B349] transition-colors line-clamp-2 flex-1">
                              {title}
                            </h5>
                            <p className="text-gray-400 text-[11px] shrink-0 mt-0.5">
                              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-[13px]">
                      No articles yet.
                    </p>
                  )}
                </div>

                {/* Recent Updates pills — hidden at lg */}
                <div className="hidden xl:flex flex-col gap-3 xl:w-[340px]">
                  <h4 className="font-['Funnel_Display'] text-[16px] font-bold text-[#1A1A1A] mb-2">
                    {t("dropdowns.whatsNew.recentUpdates")}
                  </h4>
                  {!newsLoaded
                    ? [1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-[#F5F5F5] rounded-[12px] px-5 py-3.5 animate-pulse"
                        >
                          <div className="h-4 bg-gray-200 rounded w-4/5" />
                        </div>
                      ))
                    : recentUpdates.length > 0
                      ? recentUpdates.map((article) => {
                          const title =
                            article.title[locale as "en" | "am"] ||
                            article.title.en;
                          return (
                            <Link
                              key={article._id}
                              href={`/news/${article.slug}` as any}
                              onClick={() => setActiveDropdown(null)}
                              className="bg-[#F5F5F5] rounded-[12px] px-5 py-3.5 flex items-center hover:bg-[#EBEBEB] transition-colors group"
                            >
                              <span className="text-[14px] text-[#1A1A1A] font-medium group-hover:text-[#23B349] transition-colors line-clamp-1">
                                {title}
                              </span>
                            </Link>
                          );
                        })
                      : // Fallback: show latest news as updates if no updates category found
                        latestNews
                          .concat(latestNews)
                          .slice(0, 3)
                          .map((article, i) => {
                            const title =
                              article.title[locale as "en" | "am"] ||
                              article.title.en;
                            return (
                              <Link
                                key={`${article._id}-${i}`}
                                href={`/news/${article.slug}` as any}
                                onClick={() => setActiveDropdown(null)}
                                className="bg-[#F5F5F5] rounded-[12px] px-5 py-3.5 flex items-center hover:bg-[#EBEBEB] transition-colors group"
                              >
                                <span className="text-[14px] text-[#1A1A1A] font-medium group-hover:text-[#23B349] transition-colors line-clamp-1">
                                  {title}
                                </span>
                              </Link>
                            );
                          })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
