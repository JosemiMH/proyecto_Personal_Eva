import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    noIndex?: boolean;
    language?: 'es' | 'en';
}

export default function SEO({ title, description, image, url = '/', type = 'website', noIndex = false, language = 'es' }: SEOProps) {
    const siteUrl = 'https://www.epmwellness.com';
    const fullUrl = new URL(url, siteUrl).toString();
    const defaultImage = `${siteUrl}/og-image.jpg`;
    const metaImage = image ? new URL(image, siteUrl).toString() : defaultImage;
    const finalTitle = title.includes('Eva Pérez') ? title : `${title} | Eva Pérez`;

    return (
        <Helmet>
            <html lang={language} />
            <title>{finalTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={metaImage} />
        </Helmet>
    );
}
