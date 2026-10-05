import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  /** Page-specific image – overrides the default OG image */
  image?: string;
  /** Relative or absolute URL for this page, e.g. "/sermons" or "/sermons/abc123" */
  url?: string;
  /** Open Graph content type */
  type?: 'website' | 'article';
  /** Pass a JSON-LD schema object to inject a <script type="application/ld+json"> */
  schema?: object;
  /** Comma-separated page-specific keywords (merged with site defaults) */
  keywords?: string;
  /** ISO-8601 publish time – adds article:published_time (sermons, events) */
  publishedTime?: string;
  /** ISO-8601 modified time – adds article:modified_time */
  modifiedTime?: string;
  /** Set true to prevent search engines from indexing this page (login, admin) */
  noIndex?: boolean;
}

const SITE_TITLE = 'Zion Baptist Church';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://aichappyvalley.org';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_KEYWORDS =
  'Zion Baptist Church, church Thika, Africa Inland Church, Happy Valley Thika, Kenya church, Sunday service Thika';

const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  schema,
  keywords,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = `${title} | ${SITE_TITLE}`;
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;

  // Resolve the OG image – support relative paths, absolute, or fallback
  const resolvedImage = (() => {
    if (!image) return DEFAULT_OG_IMAGE;
    if (image.startsWith('http')) return image;
    return `${SITE_URL}${image}`;
  })();

  const allKeywords = keywords
    ? `${keywords}, ${DEFAULT_KEYWORDS}`
    : DEFAULT_KEYWORDS;

  return (
    <Helmet>
      {/* ── Primary ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      )}
      <link rel="canonical" href={canonical} />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:locale" content="en_KE" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Article timestamps (sermons / events) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aichappyvalley" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* ── JSON-LD Structured Data ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema, null, 0)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
