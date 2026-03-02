import { MetadataRoute } from 'next';
import { getAllTerms } from '@/lib/dictionary';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.un-gloss.com';

    // Base important pages
    const sitemapData: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // In the future, this can be the home of the blog overview
        // {
        //     url: `${baseUrl}/blog`,
        //     lastModified: new Date(),
        //     changeFrequency: 'weekly',
        //     priority: 0.9,
        // }
    ];

    // Automate generation of dynamic dictionary pages
    const terms = getAllTerms();
    const glossaryEntries = terms.map(term => ({
        url: `${baseUrl}/meaning/${term.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...sitemapData, ...glossaryEntries];
}
