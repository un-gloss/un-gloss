import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const title = `${params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Un-gloss Blog`;
    
    return {
        title: title,
        description: 'Read the latest chaotic workplace survival tips from The Hall of Shame.',
        openGraph: {
            title: title,
            url: `https://www.un-gloss.com/blog/${params.slug}`,
            type: 'article',
            images: ['https://www.un-gloss.com/og-default.jpg'],
        }
    };
}

export default function BlogPostPage({ params }: Props) {
    const formattedTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // 3. The 'Chaos & Humor' Blog Module JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": formattedTitle,
        "image": "https://www.un-gloss.com/og-default.jpg",
        "publisher": {
            "@type": "Organization",
            "name": "Un-gloss",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.un-gloss.com/logo.png"
            }
        },
        "url": `https://www.un-gloss.com/blog/${params.slug}`,
        "datePublished": "2026-03-01T00:00:00Z",
        "dateModified": "2026-03-01T00:00:00Z",
        "author": {
            "@type": "Person",
            "name": "The Un-glosser"
        },
        "description": "Decoding corporate communications one buzzword at a time."
    };

    return (
         <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "100px 24px" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <main style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <Link href="/blog" style={{ color: "var(--electric-blue)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "24px", display: "inline-block" }}>
                    ← Back to Blog
                </Link>
                <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--glass-border)", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "16px 0", color: "var(--signal-white)", lineHeight: "1.2" }}>
                        {formattedTitle}
                    </h1>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        Published on {new Date().toLocaleDateString()}
                    </span>
                </div>

                <article className="human-text" style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--signal-white)" }}>
                    <p style={{ marginBottom: "24px" }}>
                        This is a placeholder for the full markdown-rendered content. In a production CMS, this content area would parse MDX or fetch from a headless CMS (like Sanity or Contentful).
                    </p>
                    <p style={{ marginBottom: "24px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        For now, this page demonstrates the programmatic SEO routing, the dynamic metadata generation, and the BlogPosting JSON-LD schema markup required for the "Corporate Chaos" and "Office Humor" keywords.
                    </p>
                    <Link href="/" className="action-button btn-ungloss" style={{ textDecoration: "none", display: "inline-flex", padding: "16px 32px", fontSize: "1rem", fontWeight: "bold", marginTop: "32px", justifyContent: "center", width: "100%" }}>
                        DECODE YOUR LAST EMAIL
                    </Link>
                </article>
            </main>
        </div>
    );
}
