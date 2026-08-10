import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Outfit,
  Funnel_Display,
  Inter,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@frontend/components/layout/Navbar";
import Footer from "@frontend/components/layout/Footer";
import PageLoader from "@frontend/components/ui/PageLoader";
import JsonLd from "@frontend/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  getStaticPageMetadata,
  normalizeLocale,
  organizationWebsiteJsonLd,
} from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const metadata = getStaticPageMetadata(locale, "/");
  const googleVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    ...metadata,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!["en", "am"].includes(rawLocale)) {
    notFound();
  }

  const locale = normalizeLocale(rawLocale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${funnelDisplay.variable} ${inter.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd data={organizationWebsiteJsonLd(locale)} />
        <NextIntlClientProvider messages={messages}>
          <PageLoader />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
