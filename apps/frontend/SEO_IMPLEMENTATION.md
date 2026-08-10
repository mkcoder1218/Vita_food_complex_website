# Vita Food Complex SEO implementation

Production SEO uses `https://www.vitafoodcomplex.com` as the canonical site origin.

## Included

- Per-route bilingual metadata for English and Amharic
- Self-canonical URLs and `hreflang` alternates with English as `x-default`
- Dynamic metadata for product and news detail pages
- Organization, WebSite, Product, NewsArticle and BreadcrumbList JSON-LD
- Dynamic `sitemap.xml` with published products and news
- `robots.txt` metadata route
- Open Graph and Twitter social sharing images
- Search Console verification environment-variable support
- Next.js responsive raster image optimization and asset caching
- Viewport-aware animation scheduling for smoother scrolling

## Image and scrolling performance

Raster images use Next.js image optimization with responsive `sizes`, configured quality levels, WebP output, and caching. SVG assets stay as vectors.

The Framer Motion section entrance animations remain: each section still fades/translates into place as it first enters the viewport. To reduce scroll jank, that entrance reveal runs once per page visit instead of repeatedly restarting when a section crosses the viewport boundary again.

Continuous decorative work is paused when it is off-screen and briefly while the user is actively scrolling. This applies to the hero marquee, product carousel, biscuit-brand carousel, sister-company marquee, certification marquee, and social-wall columns. The continuous animations resume after scrolling settles.

## Production environment

Set:

```bash
NEXT_PUBLIC_SITE_URL=https://www.vitafoodcomplex.com
NEXT_PUBLIC_API_URL=<existing production API URL>
```

After Google Search Console supplies an HTML-tag verification token, set only its `content` value:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<verification-token>
```

Then redeploy the frontend.

## After deployment

1. Verify `/robots.txt` returns HTTP 200.
2. Verify `/sitemap.xml` returns HTTP 200 and includes `/en` and `/am` URLs.
3. Verify representative product and news pages contain unique `<title>`, description, canonical, Open Graph and hreflang tags.
4. Add the domain property in Google Search Console and complete DNS verification if possible.
5. Submit `https://www.vitafoodcomplex.com/sitemap.xml` in Search Console.
6. Request indexing for the English homepage, Products, About, News and several important product pages.
7. Use Google's Rich Results Test for product/news structured data and fix any warnings that depend on real commercial data (for example price/offers) rather than inventing values.
