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
  // kebab-case keys matching DB section types
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
  // PascalCase fallback keys
  HeroSection,
  HeroVideoSection,
  ProductsSection,
  BiscuitBrandSection,
  SocialProofSection,
  RecipesSection,
  MerchandiseSection,
  QuickFactSection,
  SocialWallSection,
  PartnerSection,
  SisterCompaniesSection,
  FeedbackSection,
};

export default function Home({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const { locale } = params;
  const { page, loading } = usePage("home");

  // If loading or no dynamic page content, render the static version as fallback
  if (loading || !page || !page.sections || page.sections.length === 0) {
    return (
      <main className="flex flex-col min-h-screen bg-white overflow-x-hidden">
        <ScrollReveal><HeroSection /></ScrollReveal>
        <ScrollReveal><HeroVideoSection /></ScrollReveal>
        <ScrollReveal><ProductsSection /></ScrollReveal>
        <ScrollReveal><BiscuitBrandSection /></ScrollReveal>
        <ScrollReveal><RecipesSection /></ScrollReveal>
        <ScrollReveal><SocialProofSection /></ScrollReveal>
        <ScrollReveal><SisterCompaniesSection /></ScrollReveal>
        <ScrollReveal><QuickFactSection /></ScrollReveal>
        <ScrollReveal><MerchandiseSection /></ScrollReveal>
        <ScrollReveal><SocialWallSection /></ScrollReveal>
        <ScrollReveal><PartnerSection /></ScrollReveal>
        <ScrollReveal><FeedbackSection /></ScrollReveal>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {page.sections.map((section: any, index: number) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;

        return (
          <ScrollReveal key={section.id} className="relative">
            <Component content={section.content} locale={locale} />
          </ScrollReveal>
        );
      })}
    </main>
  );
}
