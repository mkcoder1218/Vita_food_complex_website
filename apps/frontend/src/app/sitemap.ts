import type { MetadataRoute } from "next";
import {
  STATIC_PAGE_DEFINITIONS,
  SUPPORTED_LOCALES,
  languageAlternates,
  localizedUrl,
  resolveApiBase,
} from "@/lib/seo";

export const revalidate = 3600;

type SitemapProduct = {
  slug?: string;
  available?: boolean;
  updatedAt?: string;
};

type SitemapNewsArticle = {
  slug?: string;
  isPublished?: boolean;
  publishedAt?: string;
  updatedAt?: string;
};

async function fetchCollection<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${resolveApiBase()}${endpoint}`, {
      next: { revalidate },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

function safeDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news] = await Promise.all([
    fetchCollection<SitemapProduct>("/products"),
    fetchCollection<SitemapNewsArticle>("/news"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = Object.entries(
    STATIC_PAGE_DEFINITIONS,
  ).flatMap(([path, definition]) => {
    if (definition.index === false) return [];

    return SUPPORTED_LOCALES.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: definition.changeFrequency,
      priority: definition.priority,
      alternates: {
        languages: languageAlternates(path),
      },
    }));
  });

  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => product.slug && product.available !== false)
    .flatMap((product) => {
      const path = `/products/${encodeURIComponent(product.slug!)}`;
      const lastModified = safeDate(product.updatedAt);

      return SUPPORTED_LOCALES.map((locale) => ({
        url: localizedUrl(locale, path),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: {
          languages: languageAlternates(path),
        },
      }));
    });

  const newsEntries: MetadataRoute.Sitemap = news
    .filter((article) => article.slug && article.isPublished !== false)
    .flatMap((article) => {
      const path = `/news/${encodeURIComponent(article.slug!)}`;
      const lastModified = safeDate(article.updatedAt) ?? safeDate(article.publishedAt);

      return SUPPORTED_LOCALES.map((locale) => ({
        url: localizedUrl(locale, path),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.72,
        alternates: {
          languages: languageAlternates(path),
        },
      }));
    });

  return [...staticEntries, ...productEntries, ...newsEntries];
}
