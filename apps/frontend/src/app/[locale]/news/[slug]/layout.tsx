import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@frontend/components/seo/JsonLd";
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

type NewsArticle = {
  _id: string;
  slug: string;
  title: { en: string; am?: string };
  summary: { en: string; am?: string };
  content: { en: string; am?: string };
  category: string;
  coverImage: string;
  readTime?: string;
  publishedAt: string;
  updatedAt?: string;
  isPublished: boolean;
};

type NewsLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

async function getArticle(slug: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(
      `${resolveApiBase()}/news/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120 } },
    );

    if (!response.ok) return null;
    return (await response.json()) as NewsArticle;
  } catch {
    return null;
  }
}

function localizedArticleCopy(article: NewsArticle, locale: "en" | "am") {
  return {
    title:
      locale === "am" ? article.title.am || article.title.en : article.title.en,
    summary:
      locale === "am"
        ? article.summary.am || article.summary.en
        : article.summary.en,
  };
}

export async function generateMetadata({
  params,
}: Omit<NewsLayoutProps, "children">): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const article = await getArticle(slug);

  if (!article || article.isPublished === false) {
    return buildMetadata({
      locale,
      path: `/news/${slug}`,
      title: `Article Not Found | ${SITE_NAME}`,
      description: "The requested Vita Food Complex article could not be found.",
      index: false,
    });
  }

  const copy = localizedArticleCopy(article, locale);
  const baseMetadata = buildMetadata({
    locale,
    path: `/news/${article.slug}`,
    title: `${copy.title} | ${SITE_NAME}`,
    description: copy.summary,
    image: article.coverImage,
    keywords: [
      copy.title,
      "Vita Food Complex news",
      "Vita Ethiopia",
      "food industry Ethiopia",
      article.category,
    ],
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...(baseMetadata.openGraph ?? {}),
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      authors: [SITE_NAME],
      section: article.category,
    },
  };
}

export default async function NewsArticleLayout({
  children,
  params,
}: NewsLayoutProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const article = await getArticle(slug);

  if (!article || article.isPublished === false) {
    return children;
  }

  const copy = localizedArticleCopy(article, locale);
  const articlePath = `/news/${article.slug}`;
  const articleUrl = localizedUrl(locale, articlePath);
  const image = absoluteMediaUrl(article.coverImage);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${articleUrl}#article`,
    headline: copy.title,
    description: copy.summary,
    mainEntityOfPage: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    ...(image ? { image: [image] } : {}),
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: locale,
    articleSection: article.category,
  };

  const breadcrumbs = breadcrumbJsonLd(locale, [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: copy.title, path: articlePath },
  ]);

  return (
    <>
      <JsonLd data={articleStructuredData} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
