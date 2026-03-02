import { Metadata } from 'next';
import Link from 'next/link';
import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const postData = await getPostData(params.slug);
    
    // Fallback if not found
    const title = postData ? `${postData.title} - Un-gloss Blog` : 'Post Not Found';
    const description = postData ? postData.excerpt : 'The Hall of Shame.';
    
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

export async function generateStaticParams() {
    return getAllPostSlugs();
}

export default async function BlogPostPage({ params }: Props) {
    const postData = await getPostData(params.slug);

    if (!postData) {
        notFound();
    }

    // 3. The 'Chaos & Humor' Blog Module JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postData.title,
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
        "datePublished": new Date(postData.date).toISOString(),
        "dateModified": new Date(postData.date).toISOString(),
        "author": {
            "@type": "Person",
            "name": "The Un-glosser"
        },
        "description": postData.excerpt
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
                        {postData.title}
                    </h1>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        Published on {postData.date} • <span style={{color: "var(--electric-blue)"}}>{postData.category}</span>
                    </span>
                </div>

                <article className="human-text blog-content" style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--signal-white)" }}>
                    <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} />

                    <Link href="/" className="action-button btn-ungloss" style={{ textDecoration: "none", display: "inline-flex", padding: "16px 32px", fontSize: "1rem", fontWeight: "bold", marginTop: "48px", justifyContent: "center", width: "100%" }}>
                        DECODE YOUR LAST EMAIL
                    </Link>
                </article>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .blog-content h2 { margin-top: 2em; margin-bottom: 1em; font-size: 1.8rem; color: var(--electric-blue); }
                    .blog-content h3 { margin-top: 1.5em; margin-bottom: 0.8em; font-size: 1.4rem; color: var(--signal-white); }
                    .blog-content p { margin-bottom: 1.5em; }
                    .blog-content ul, .blog-content ol { margin-bottom: 1.5em; padding-left: 2em; }
                    .blog-content li { margin-bottom: 0.5em; }
                    .blog-content blockquote { border-left: 4px solid var(--warning-orange); padding-left: 1em; color: var(--text-muted); font-style: italic; background: rgba(255,87,34,0.05); padding: 1em; margin-bottom: 1.5em; }
                    .blog-content strong { color: var(--signal-white); background: rgba(255,255,255,0.1); padding: 0 4px; border-radius: 4px; }
                    `
                }} />
            </main>
        </div>
    );
}
