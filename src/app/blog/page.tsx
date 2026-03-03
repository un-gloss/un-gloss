import Link from "next/link";
import { Metadata } from 'next';
import { getSortedPostsData } from "@/lib/blog";
import { PRESS_RELEASES } from "@/lib/pressReleases";
import { FaSyncAlt } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'The Hall of Shame Blog | Un-gloss Corporate Culture',
    description: 'Humorous takes on corporate chaos, passive-aggressive emails, and the most confusing phrases of 2026. Navigating office politics one buzzword at a time.',
};

export default function BlogIndex() {
    // Dynamically fetch from the CMS
    const posts = getSortedPostsData();

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "40px 24px" }}>
            
            <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
                <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--glass-border)", marginBottom: "40px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--warning-orange)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "bold" }}>
                        The Hall of Shame Articles
                    </span>
                    <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "16px 0", color: "var(--signal-white)" }}>
                        Surviving the Corporate Fog
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "800px" }}>
                        Deep dives into office politics, the psychology of jargon, and live translations of the world's most confusing press releases.
                    </p>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .blog-layout-grid {
                        display: grid;
                        grid-template-columns: 1.8fr 1fr;
                        gap: 48px;
                        align-items: start;
                    }
                    @media (max-width: 1000px) {
                        .blog-layout-grid {
                            grid-template-columns: 1fr;
                        }
                    }
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
                    .pr-card {
                        position: relative;
                        overflow: hidden;
                    }
                    .pr-card .translated-view {
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: var(--dark-bg);
                        padding: 24px;
                        border: 1px solid var(--warning-orange);
                        border-radius: 12px;
                        opacity: 0;
                        transform: translateY(10px);
                        transition: all 0.3s ease;
                        pointer-events: none;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .pr-card:hover .translated-view {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    `
                }} />
                
                <div className="blog-layout-grid">
                    {/* Left Column: Traditional Blog Posts */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
                            Latest Articles
                        </h2>
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

                    {/* Right Column: Corporate BS Breakdowns */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "40px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--warning-orange)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Corporate B.S. Breakdowns
                            </h2>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Hover to Un-gloss</span>
                        </div>
                        
                        {PRESS_RELEASES.map(pr => (
                            <div key={pr.id} className="glass-panel pr-card" style={{ padding: "24px", cursor: "default", minHeight: "220px" }}>
                                {/* Original View */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {pr.date} • {pr.category}
                                    </span>
                                    <span style={{ fontSize: "0.9rem", color: "var(--electric-blue)", fontWeight: "bold" }}>
                                        SOURCE: {pr.source}
                                    </span>
                                    <h3 style={{ fontSize: "1.2rem", color: "var(--signal-white)", margin: "4px 0" }}>
                                        "{pr.title}"
                                    </h3>
                                </div>
                                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic", lineHeight: "1.5" }}>
                                    "{pr.original}"
                                </p>

                                {/* Hover Translated View */}
                                <div className="translated-view">
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--warning-orange)" }}>
                                        <FaSyncAlt />
                                        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                                            Un-glossed Reality
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "1.2rem", color: "var(--signal-white)", fontWeight: "bold", lineHeight: "1.4", margin: 0 }}>
                                        "{pr.translated}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
