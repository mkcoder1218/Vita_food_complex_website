import type { Metadata, MetadataRoute } from "next";

export const SITE_NAME = "Vita Food Complex";
export const BRAND_NAME = "Vita";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vitafoodcomplex.com").replace(/\/+$/, "");
export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "am"] as const;
export type SiteLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_DESCRIPTION =
  "Experience the perfect blend of nutrition and flavor with Vita's premium range of biscuits and flour products, made in Ethiopia.";

export const SEO_KEYWORDS = [
  "biscuit manufacturer Ethiopia",
  "flour manufacturer Ethiopia",
  "Ethiopian food manufacturer",
  "Vita Food Complex",
  "Vita foods",
  "Vita biscuits",
  "biscuits Ethiopia",
  "flour Ethiopia",
  "food manufacturer Addis Ababa",
];

export const SOCIAL_LINKS = [
  "https://www.facebook.com/VitaFood/",
  "https://www.instagram.com/vitafood",
];

export const COMPANY = {
  legalName: "Vita Food Complex",
  brandName: BRAND_NAME,
  foundingDate: "2026",
  parentOrganization: "Belayab Foods",
  phone: "+251 911 123 456",
  email: "info@vitafoodcomplex.com",
  streetAddress: "Lideta SC, Woreda 02",
  city: "Addis Ababa",
  region: "Addis Ababa",
  countryCode: "ET",
  logoPath: "/assets/brand/vita-logo.svg",
} as const;

type PageCopy = { title: string; description: string };
type PageDefinition = {
  en: PageCopy;
  am: PageCopy;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  index?: boolean;
};

export type StaticPagePath =
  | "/"
  | "/products"
  | "/recipes"
  | "/about"
  | "/why-choose-vita"
  | "/careers"
  | "/sustainability"
  | "/people-planet"
  | "/innovation"
  | "/we-care"
  | "/gallery"
  | "/terms"
  | "/become-distributor"
  | "/research"
  | "/faqs"
  | "/news"
  | "/contact";

const am = (title: string, description: string): PageCopy => ({ title, description });

export const STATIC_PAGE_DEFINITIONS: Record<StaticPagePath, PageDefinition> = {
  "/": {
    en: {
      title: "Vita Food Complex | Biscuits & Flour Manufacturer in Ethiopia",
      description: "Discover Vita Food Complex, an Ethiopian food manufacturer offering premium biscuits and flour products crafted for nutrition, quality, and everyday enjoyment.",
    },
    am: am("ቪታ ፉድ ኮምፕሌክስ | ብስኩትና ዱቄት አምራች በኢትዮጵያ", "ቪታ ፉድ ኮምፕሌክስ ጥራት፣ ንጥረ ምግብ እና ጣዕም የሚያጣምሩ ብስኩቶችን እና የዱቄት ምርቶችን በኢትዮጵያ ያቀርባል።"),
    changeFrequency: "weekly", priority: 1,
  },
  "/products": {
    en: { title: "Biscuits & Flour Products | Vita Food Complex", description: "Explore Vita's range of biscuits and flour products for families, retailers, distributors, bakeries, and food-service businesses in Ethiopia." },
    am: am("የቪታ ብስኩትና ዱቄት ምርቶች | ቪታ ፉድ ኮምፕሌክስ", "ለቤተሰቦች፣ ለቸርቻሪዎች፣ ለአከፋፋዮች እና ለዳቦ ቤቶች የተዘጋጁ የቪታ ምርቶችን ይመልከቱ።"),
    changeFrequency: "weekly", priority: 0.95,
  },
  "/recipes": {
    en: { title: "Recipes with Vita Biscuits & Flour | Vita Food Complex", description: "Discover recipe ideas, baking inspiration, and serving suggestions using Vita biscuits and flour products." },
    am: am("በቪታ ብስኩትና ዱቄት የሚዘጋጁ አሰራሮች | ቪታ", "የቪታ ምርቶችን በመጠቀም የምግብ አሰራሮችን እና የመጋገር ሀሳቦችን ያግኙ።"),
    changeFrequency: "monthly", priority: 0.75,
  },
  "/about": {
    en: { title: "About Vita Food Complex | Ethiopian Food Manufacturer", description: "Learn about Vita Food Complex, our story, manufacturing approach, values, and relationship with Belayab Foods in Ethiopia." },
    am: am("ስለ ቪታ ፉድ ኮምፕሌክስ | የኢትዮጵያ ምግብ አምራች", "ስለ ቪታ ፉድ ኮምፕሌክስ ታሪክ፣ እሴቶች እና ከበላያብ ፉድስ ጋር ያለውን ግንኙነት ይወቁ።"),
    changeFrequency: "monthly", priority: 0.8,
  },
  "/why-choose-vita": {
    en: { title: "Why Choose Vita | Quality Biscuits & Flour in Ethiopia", description: "See why customers and partners choose Vita for dependable quality, manufacturing standards, and biscuit and flour products in Ethiopia." },
    am: am("ለምን ቪታን ይምረጡ? | ጥራት ያለው ብስኩትና ዱቄት", "ደንበኞችና አጋሮች ቪታን ለጥራት እና ለታማኝ ምርቶች ለምን እንደሚመርጡ ይመልከቱ።"),
    changeFrequency: "monthly", priority: 0.75,
  },
  "/careers": {
    en: { title: "Careers at Vita Food Complex | Ethiopia", description: "Explore career opportunities at Vita Food Complex and help build quality food products for consumers across Ethiopia." },
    am: am("የሥራ ዕድሎች በቪታ ፉድ ኮምፕሌክስ | ኢትዮጵያ", "በቪታ ፉድ ኮምፕሌክስ ያሉ የሥራ ዕድሎችን ይመልከቱ።"),
    changeFrequency: "weekly", priority: 0.7,
  },
  "/sustainability": {
    en: { title: "Sustainability | Vita Food Complex", description: "Learn about Vita Food Complex's approach to responsible food manufacturing, communities, resources, and long-term sustainability." },
    am: am("ዘላቂነት | ቪታ ፉድ ኮምፕሌክስ", "ቪታ ለኃላፊነት ያለው ምግብ ማምረት እና ዘላቂ ዕድገት ያለውን አቀራረብ ይወቁ።"),
    changeFrequency: "monthly", priority: 0.7,
  },
  "/people-planet": {
    en: { title: "People & Planet | Vita Food Complex", description: "Discover Vita initiatives focused on people, communities, responsible growth, and positive impact in Ethiopia." },
    am: am("ሰዎች እና ፕላኔት | ቪታ ፉድ ኮምፕሌክስ", "በሰዎች፣ ማህበረሰቦች እና ኃላፊነት ያለው ዕድገት ላይ ያተኮሩ የቪታ ተነሳሽነቶችን ያግኙ።"),
    changeFrequency: "monthly", priority: 0.7,
  },
  "/innovation": {
    en: { title: "Food Innovation | Vita Food Complex", description: "Explore how Vita approaches product development, quality, and innovation across biscuits and flour products." },
    am: am("የምግብ ፈጠራ | ቪታ ፉድ ኮምፕሌክስ", "ቪታ በምርት ልማት፣ ጥራት እና ፈጠራ ያለውን አቀራረብ ይመልከቱ።"),
    changeFrequency: "monthly", priority: 0.65,
  },
  "/we-care": {
    en: { title: "We Care for All | Vita Food Complex", description: "Learn about Vita's commitment to consumers, employees, communities, and responsible food manufacturing in Ethiopia." },
    am: am("We Care for All | ቪታ ፉድ ኮምፕሌክስ", "ቪታ ለደንበኞች፣ ሰራተኞች እና ማህበረሰቦች ያለውን ቁርጠኝነት ይወቁ።"),
    changeFrequency: "monthly", priority: 0.65,
  },
  "/gallery": {
    en: { title: "Gallery | Vita Food Complex", description: "See Vita Food Complex products, people, community activities, and moments from our work in Ethiopia." },
    am: am("ጋለሪ | ቪታ ፉድ ኮምፕሌክስ", "የቪታ ምርቶችን፣ ሰዎችን እና የማህበረሰብ እንቅስቃሴዎችን ይመልከቱ።"),
    changeFrequency: "monthly", priority: 0.55,
  },
  "/terms": {
    en: { title: "Terms & Conditions | Vita Food Complex", description: "Read the terms and conditions for using the Vita Food Complex website." },
    am: am("ውሎች እና ሁኔታዎች | ቪታ ፉድ ኮምፕሌክስ", "የቪታ ድረ-ገጽን ለመጠቀም የሚመለከቱ ውሎችን ያንብቡ።"),
    changeFrequency: "yearly", priority: 0.2, index: false,
  },
  "/become-distributor": {
    en: { title: "Become a Vita Distributor | Ethiopia", description: "Apply to become a Vita distributor and help bring Vita biscuits and flour products to customers across Ethiopia." },
    am: am("የቪታ አከፋፋይ ይሁኑ | ኢትዮጵያ", "የቪታ አከፋፋይ ለመሆን ያመልክቱ እና ምርቶቻችንን ለደንበኞች ያድርሱ።"),
    changeFrequency: "monthly", priority: 0.8,
  },
  "/research": {
    en: { title: "Research & Resources | Vita Food Complex", description: "Explore research, resources, and useful information from Vita Food Complex about food, products, and manufacturing." },
    am: am("ጥናት እና መረጃዎች | ቪታ ፉድ ኮምፕሌክስ", "ስለ ምግብ፣ ምርቶች እና ማምረት ከቪታ የሚቀርቡ ጥናቶችን እና መረጃዎችን ያግኙ።"),
    changeFrequency: "monthly", priority: 0.6,
  },
  "/faqs": {
    en: { title: "Frequently Asked Questions | Vita Food Complex", description: "Find answers to common questions about Vita products, distribution, the company, and customer support." },
    am: am("ተደጋጋሚ ጥያቄዎች | ቪታ ፉድ ኮምፕሌክስ", "ስለ ቪታ ምርቶች፣ ስርጭት፣ ኩባንያው እና የደንበኞች ድጋፍ መልሶችን ያግኙ።"),
    changeFrequency: "monthly", priority: 0.6,
  },
  "/news": {
    en: { title: "News & Articles | Vita Food Complex", description: "Read the latest news, company updates, product stories, and articles from Vita Food Complex in Ethiopia." },
    am: am("ዜና እና ጽሑፎች | ቪታ ፉድ ኮምፕሌክስ", "ከቪታ ፉድ ኮምፕሌክስ የቅርብ ጊዜ ዜናዎችን እና ጽሑፎችን ያንብቡ።"),
    changeFrequency: "daily", priority: 0.8,
  },
  "/contact": {
    en: { title: "Contact Vita Food Complex | Addis Ababa, Ethiopia", description: "Contact Vita Food Complex in Addis Ababa for product questions, partnerships, distribution, business inquiries, and customer support." },
    am: am("ቪታ ፉድ ኮምፕሌክስን ያግኙ | አዲስ አበባ", "ለምርት ጥያቄዎች፣ አጋርነት፣ ስርጭት እና የደንበኛ ድጋፍ ቪታን ያግኙ።"),
    changeFrequency: "yearly", priority: 0.75,
  },
};

export function normalizeLocale(locale?: string): SiteLocale { return locale === "am" ? "am" : "en"; }
export function normalizePath(path: string): string { if (!path || path === "/") return "/"; return `/${path.replace(/^\/+|\/+$/g, "")}`; }
export function absoluteUrl(path = "/"): string { const p = normalizePath(path); return p === "/" ? SITE_URL : `${SITE_URL}${p}`; }
export function localizedUrl(locale: SiteLocale, path = "/"): string { const p = normalizePath(path); return p === "/" ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${p}`; }
export function absoluteMediaUrl(value?: string | null): string | undefined { if (!value) return undefined; return /^https?:\/\//i.test(value) ? value : absoluteUrl(value); }
export function languageAlternates(path: string) { return { en: localizedUrl("en", path), am: localizedUrl("am", path), "x-default": localizedUrl("en", path) }; }

export function buildMetadata({ locale, path, title, description, index = true, image, keywords = SEO_KEYWORDS }: { locale: SiteLocale; path: string; title: string; description: string; index?: boolean; image?: string; keywords?: string[] }): Metadata {
  const imageUrl = absoluteMediaUrl(image);
  return {
    metadataBase: new URL(SITE_URL), title, description, keywords, applicationName: SITE_NAME, category: "Food & Beverage Manufacturing",
    alternates: { canonical: localizedUrl(locale, path), languages: languageAlternates(path) },
    robots: { index, follow: index, googleBot: { index, follow: index, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { type: "website", url: localizedUrl(locale, path), siteName: SITE_NAME, title, description, locale: locale === "am" ? "am_ET" : "en_ET", alternateLocale: locale === "am" ? ["en_ET"] : ["am_ET"], ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(imageUrl ? { images: [imageUrl] } : {}) },
  };
}

export function getStaticPageMetadata(locale: SiteLocale, path: StaticPagePath): Metadata {
  const definition = STATIC_PAGE_DEFINITIONS[path];
  const copy = definition[locale];
  return buildMetadata({ locale, path, title: copy.title, description: copy.description, index: definition.index !== false });
}

export function createStaticMetadata(path: StaticPagePath) {
  return async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getStaticPageMetadata(normalizeLocale(locale), path);
  };
}

export function resolveApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api/v1";
  const urls = raw.split(",").map((u) => u.trim()).filter(Boolean).map((u) => { const t = u.replace(/\/+$/, ""); return t.endsWith("/api/v1") ? t : `${t}/api/v1`; });
  if (!urls.length) return "http://localhost:4002/api/v1";
  return process.env.NODE_ENV === "production" ? (urls.find((u) => !u.includes("localhost")) ?? urls[0]) : urls[0];
}

export function organizationWebsiteJsonLd(locale: SiteLocale) {
  const homeUrl = localizedUrl(locale, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: COMPANY.legalName, alternateName: COMPANY.brandName, url: SITE_URL, logo: { "@type": "ImageObject", url: absoluteMediaUrl(COMPANY.logoPath) }, foundingDate: COMPANY.foundingDate, parentOrganization: { "@type": "Organization", name: COMPANY.parentOrganization }, description: DEFAULT_DESCRIPTION, email: COMPANY.email, telephone: COMPANY.phone, address: { "@type": "PostalAddress", streetAddress: COMPANY.streetAddress, addressLocality: COMPANY.city, addressRegion: COMPANY.region, addressCountry: COMPANY.countryCode }, contactPoint: [{ "@type": "ContactPoint", telephone: COMPANY.phone, email: COMPANY.email, contactType: "customer service", areaServed: COMPANY.countryCode, availableLanguage: ["English", "Amharic"] }], sameAs: SOCIAL_LINKS },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: locale, publisher: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "WebPage", "@id": `${homeUrl}#webpage`, url: homeUrl, name: STATIC_PAGE_DEFINITIONS["/"][locale].title, description: STATIC_PAGE_DEFINITIONS["/"][locale].description, inLanguage: locale, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#organization` } },
    ],
  };
}

export function breadcrumbJsonLd(locale: SiteLocale, items: Array<{ name: string; path: string }>) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: localizedUrl(locale, item.path) })) };
}
