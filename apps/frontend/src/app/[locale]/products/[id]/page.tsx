import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@frontend/navigation";
import { Product } from "../data";
import ProductTestimonials from "@frontend/components/products/ProductTestimonials";
import ProductHeroSection from "@frontend/components/products/ProductDetailsHeroSection";
import ProductNutritionSection from "@frontend/components/products/ProductNutritionSection";
import ProductRelatedSection from "@frontend/components/products/ProductRelatedSection";
import JsonLd from "@frontend/components/seo/JsonLd";
import { notFound } from "next/navigation";
import {
  SITE_NAME,
  SITE_URL,
  absoluteMediaUrl,
  breadcrumbJsonLd,
  buildMetadata,
  localizedUrl,
  normalizeLocale,
  resolveApiBase,
} from "@/lib/seo";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

type ApiProduct = {
  _id: string;
  slug: string;
  name: { en: string; am: string };
  category: "Biscuit" | "Flour";
  media: { image: string; tagIcon?: string };
  ui: { bgColor: string; textColor: string; nameColor: string };
  colorVariations?: { colorCode: string; bgColor: string }[];
  relatedProducts?: string[];
  content?: {
    description?: { en: string; am: string };
    netWeight?: string;
    nutrition?: Product["content"] extends { nutrition?: infer T } ? T : never;
    ingredients?: Product["content"] extends { ingredients?: infer T } ? T : never;
    certifications?: Product["content"] extends { certifications?: infer T } ? T : never;
  };
  available?: boolean;
};

type FrontendProduct = Product & { _id: string };

function normalizeApiV1Base(url: string): string {
  const trimmed = url.replace(/\/+$/, "");
  if (trimmed.endsWith("/api/v1")) return trimmed;
  return `${trimmed}/api/v1`;
}

function resolveProductApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api/v1";
  const urls = raw.split(",").map((u) => normalizeApiV1Base(u.trim()));
  return urls.length > 1
    ? process.env.NODE_ENV === "production"
      ? (urls.find((u) => !u.includes("localhost")) ?? urls[0])
      : urls[0]
    : urls[0];
}

function mapApiProduct(item: ApiProduct, locale: string): FrontendProduct {
  return {
    _id: item._id,
    id: item.slug,
    name: locale === "am" ? item.name.am || item.name.en : item.name.en,
    category: item.category,
    media: {
      image: item.media?.image || "/assets/products/items/zoo-1.png",
      ...(item.media?.tagIcon ? { tagIcon: item.media.tagIcon } : {}),
    },
    ui: item.ui ?? {
      bgColor: "linear-gradient(135deg, #23B349 0%, #1a9e3e 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    colorVariations: item.colorVariations ?? [],
    relatedProducts: item.relatedProducts ?? [],
    content: item.content
      ? {
          ...(item.content.description
            ? {
                description:
                  locale === "am"
                    ? item.content.description.am || item.content.description.en
                    : item.content.description.en,
              }
            : {}),
          ...(item.content.netWeight ? { netWeight: item.content.netWeight } : {}),
          ...(item.content.nutrition ? { nutrition: item.content.nutrition } : {}),
          ...(item.content.ingredients ? { ingredients: item.content.ingredients } : {}),
          ...(item.content.certifications
            ? { certifications: item.content.certifications }
            : {}),
        }
      : undefined,
  };
}

async function getApiProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const response = await fetch(
      `${resolveApiBase()}/products/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120 } },
    );

    if (!response.ok) return null;
    return (await response.json()) as ApiProduct;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const product = await getApiProduct(id);

  if (!product) {
    return buildMetadata({
      locale,
      path: `/products/${id}`,
      title: `Product Not Found | ${SITE_NAME}`,
      description: "The requested Vita product could not be found.",
      index: false,
    });
  }

  const name =
    locale === "am" ? product.name.am || product.name.en : product.name.en;
  const description =
    (locale === "am"
      ? product.content?.description?.am || product.content?.description?.en
      : product.content?.description?.en) ||
    `Discover ${name}, a ${product.category.toLowerCase()} product from Vita Food Complex in Ethiopia.`;

  return buildMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${name} | ${SITE_NAME}`,
    description,
    index: product.available !== false,
    image: product.media?.image,
    keywords: [
      name,
      `${name} Ethiopia`,
      `Vita ${product.category.toLowerCase()}`,
      `${product.category.toLowerCase()} manufacturer Ethiopia`,
      "Vita Food Complex",
    ],
  });
}

// Starburst component moved to ProductRelatedSection
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id, locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale, namespace: "ProductsPage" });

  if (!id) {
    return null;
  }

  const apiBase = resolveProductApiBase();
  const [productRes, listRes] = await Promise.all([
    fetch(`${apiBase}/products/${encodeURIComponent(id)}`, { next: { revalidate: 120 } }),
    fetch(`${apiBase}/products`, { next: { revalidate: 120 } }),
  ]);

  if (!productRes.ok) {
    notFound();
  }

  const productJson = (await productRes.json()) as ApiProduct;
  const listJson = listRes.ok ? ((await listRes.json()) as ApiProduct[]) : [];
  const product = mapApiProduct(productJson, locale);
  const allProducts = Array.isArray(listJson)
    ? listJson
        .filter((p) => p.available !== false)
        .map((p) => mapApiProduct(p, locale))
    : [];

  if (!product) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="font-['Funnel_Display'] text-3xl text-[#0f4b1f]">
          {t("productNotFound")}
        </h1>
        <Link href="/products" className="mt-4 text-[#23B349] hover:underline">
          {t("backToProducts")}
        </Link>
      </main>
    );
  }

  // Related products (IDs currently stored as product _id strings in backend).
  const relatedProductIds = product.relatedProducts || [];
  let relatedProducts = relatedProductIds
    .map((relatedId) =>
      allProducts.find((p) => p._id === relatedId || p.id === relatedId),
    )
    .filter((p): p is FrontendProduct => p !== undefined);

  if (relatedProducts.length === 0) {
    relatedProducts = allProducts.filter((p) => p.id !== id).slice(0, 4);
  }

  const productPath = `/products/${productJson.slug}`;
  const productUrl = localizedUrl(normalizedLocale, productPath);
  const productDescription =
    product.content?.description ||
    `Discover ${product.name}, a ${product.category.toLowerCase()} product from Vita Food Complex in Ethiopia.`;
  const productImage = absoluteMediaUrl(product.media.image);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: productDescription,
    url: productUrl,
    ...(productImage ? { image: [productImage] } : {}),
    sku: productJson.slug,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Vita",
    },
    manufacturer: {
      "@id": `${SITE_URL}/#organization`,
    },
    ...(product.content?.netWeight
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Net weight",
              value: product.content.netWeight,
            },
          ],
        }
      : {}),
  };

  const productBreadcrumbs = breadcrumbJsonLd(normalizedLocale, [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: productPath },
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <JsonLd data={productStructuredData} />
      <JsonLd data={productBreadcrumbs} />

      {/* Hero Section */}
      <ProductHeroSection product={product} />

      {/* Main Content Area (Nutrition Facts & Ingredients) */}
      <ProductNutritionSection product={product} />

      {/* Related Products */}
      <ProductRelatedSection relatedProducts={relatedProducts} />

      {/* Testimonials */}
      <ProductTestimonials />
    </main>
  );
}
