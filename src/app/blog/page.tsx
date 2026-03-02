import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle"; // Optional but keeps UX consistent
import { Metadata } from 'next';
import { getSortedPostsData } from "@/lib/blog";

export const metadata: Metadata = {
    title: 'The Hall of Shame Blog | Un-gloss Corporate Culture',
    description: 'Humorous takes on corporate chaos, passive-aggressive emails, and the most confusing phrases of 2026. Navigating office politics one buzzword at a time.',
};

export default function BlogIndex() {
    // Dynamically fetch from the CMS
    const posts = getSortedPostsData();

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "40px 24px" }}>
             <header style={{
                position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
                display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px",
                borderBottom: "1px solid var(--glass-border)", background: "var(--obsidian)"
            }}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.05em", color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--electric-blue)", marginRight: "4px" }}>U/</span>
                        <span style={{ color: "var(--signal-white)" }}>Un</span>gloss
                    </div>
                </Link>
                <div style={{ display: "flex", gap: "24px", alignItems: "center", fontSize: "0.85rem", fontWeight: "bold", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                     <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Translator</Link>
                     <span style={{ color: "var(--signal-white)" }}>Blog</span>
                </div>
            </header>

            <main style={{ maxWidth: "800px", margin: "80px auto 0", width: "100%" }}>
                <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--glass-border)", marginBottom: "40px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--warning-orange)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "bold" }}>
                        The Hall of Shame Articles
                    </span>
                    <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "16px 0", color: "var(--signal-white)" }}>
                        Surviving the Corporate Fog
                    </h1>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .blog-card-hover {
                        border: 1px solid rgba(255,255,255,0.05) !important;
                        transition: all 0.2s ease;
                        cursor: pointer;
                    }
                    .blog-card-hover:hover {
                        border-color: var(--electric-blue) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                    }
                    `
                }} />
                
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                            <div className="glass-panel blog-card-hover" style={{ padding: "32px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                     <span style={{ fontSize: "0.75rem", color: "var(--electric-blue)", textTransform: "uppercase", fontWeight: "bold", background: "rgba(0,123,255,0.1)", padding: "4px 8px", borderRadius: "12px" }}>
                                        {post.category}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                        {post.date}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: "1.8rem", color: "var(--signal-white)", marginBottom: "16px", fontWeight: "bold" }}>
                                    {post.title}
                                </h2>
                                <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
