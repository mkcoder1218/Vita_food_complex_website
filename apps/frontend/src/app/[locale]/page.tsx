"use client";

import { use } from "react";
import { usePage } from "@/hooks/usePage";
import HeroSection from "@frontend/components/sections/HeroSection";
import HeroVideoSection from "@frontend/components/sections/HeroVideoSection";
import ProductsSection from "@frontend/components/products/ProductsSection";
import BiscuitBrandSection from "@frontend/components/sections/BiscuitBrandSection";
import SocialProofSection from "@frontend/components/sections/SocialProofSection";
import RecipesSection from "@frontend/components/sections/RecipesSection";
import MerchandiseSection from "@frontend/components/sections/MerchandiseSection";
import QuickFactSection from "@frontend/components/sections/QuickFactSection";
import SocialWallSection from "@frontend/components/sections/SocialWallSection";
import PartnerSection from "@frontend/components/sections/PartnerSection";
import SisterCompaniesSection from "@frontend/components/sections/SisterCompaniesSection";
import FeedbackSection from "@frontend/components/sections/FeedbackSection";
import ScrollReveal from "@frontend/components/ui/ScrollReveal";

const SECTION_COMPONENTS: Record<string, any> = {
  hero: HeroSection,
  "hero-video": HeroVideoSection,
  recipes: RecipesSection,
  products: ProductsSection,
  "biscuit-brand": BiscuitBrandSection,
  "social-proof": SocialProofSection,
  "quick-facts": QuickFactSection,
  merchandise: MerchandiseSection,
  "social-wall": SocialWallSection,
  partners: PartnerSection,
  "sister-companies": SisterCompaniesSection,
  feedback: FeedbackSection,
};

const SECTION_ALIASES: Record<string, string> = {
  HeroSection: "hero",
  HeroVideoSection: "hero-video",
  ProductsSection: "products",
  BiscuitBrandSection: "biscuit-brand",
  SocialProofSection: "social-proof",
  RecipesSection: "recipes",
  MerchandiseSection: "merchandise",
  QuickFactSection: "quick-facts",
  SocialWallSection: "social-wall",
  PartnerSection: "partners",
  SisterCompaniesSection: "sister-companies",
  FeedbackSection: "feedback",
};

const DEFAULT_SECTION_ORDER = [
  "hero",
  "hero-video",
  "products",
  "biscuit-brand",
  "recipes",
  "social-proof",
  "sister-companies",
  "quick-facts",
  "merchandise",
  "social-wall",
  "partners",
  "feedback",
] as const;

function normalizeSectionType(type: string): string {
  return SECTION_ALIASES[type] ?? type;
}

export default function Home({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const { locale } = params;
  const { page, loading } = usePage("home");

  const hasCmsSections =
    !loading &&
    Array.isArray(page?.sections) &&
    page.sections.length > 0;

  // Render the same component tree before and after CMS data arrives. Previously
  // the static fallback was replaced by a differently keyed dynamic tree, which
  // remounted image-heavy sections and caused visible image/SVG pop-in.
  const sections = hasCmsSections
    ? page.sections.map((section: any) => ({
        type: normalizeSectionType(section.type),
        content: section.content,
      }))
    : DEFAULT_SECTION_ORDER.map((type) => ({
        type,
        content: undefined,
      }));

  return (
    <main className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {sections.map((section: any, index: number) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;

        return (
          <ScrollReveal
            key={`${section.type}-${index}`}
            className="relative"
          >
            <Component content={section.content} locale={locale} />
          </ScrollReveal>
        );
      })}
    </main>
  );
}
