import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Protect our API and dynamic translation backend from excessive bot scraping
            disallow: ['/api/', '/thread/'],
        },
        sitemap: 'https://www.un-gloss.com/sitemap.xml',
        // Example: block GPTbot or specific scrapers if required by business logic later
        host: 'https://www.un-gloss.com',
    };
}
