"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, where, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FaBullhorn, FaCommentAlt, FaShare } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { getAllTerms } from "@/lib/dictionary";
import AdSenseWidget from "./AdSenseWidget";

// Temporary mock data until Firebase is fully connected by the user
const MOCK_FEED = [
    {
        id: "1",
        originalText: "We need to dynamically circle back and leverage our core competencies.",
        translation: "We must review and use our skills.",
        bsScore: 95,
        timestamp: "2026-02-28T12:00:00Z"
    },
    {
        id: "2",
        originalText: "Can we put a pin in this and take it offline?",
        translation: "Let's stop talking about this now.",
        bsScore: 88,
        timestamp: "2026-02-28T13:30:00Z"
    },
    {
        id: "3",
        originalText: "We need to boil the ocean to find the low-hanging fruit.",
        translation: "We must do everything to find easy wins.",
        bsScore: 100,
        timestamp: "2026-02-28T14:45:00Z"
    }
];

export interface FeedFilter {
    field: string;
    operator: "==";
    value: string;
}

// SEO Smart Linking: Scans text for dictionary terms and wraps them in Links
const RichTextRenderer = ({ text }: { text: string }) => {
    const terms = getAllTerms();
    
    // Create a safe, escaped regex pattern of all terms, sorted by length descending so longer phrases match first
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
    const escapedTerms = sortedTerms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return (
        <p style={{ fontSize: "1rem", lineHeight: "1.5" }} className="human-text">
            {parts.map((part, i) => {
                const lowerPart = part.toLowerCase();
                const matchedTerm = terms.find(t => t.term.toLowerCase() === lowerPart);
                
                if (matchedTerm) {
                    return (
                        <Link 
                            key={i} 
                            href={`/meaning/${matchedTerm.slug}`}
                            onClick={(e) => e.stopPropagation()} // Prevent clicking the card behind the link
                            style={{ color: "var(--electric-blue)", textDecoration: "none", fontWeight: "bold", borderBottom: "1px dashed var(--electric-blue)" }}
                            onMouseOver={(e) => e.currentTarget.style.color = "var(--warning-orange)"}
                            onMouseOut={(e) => e.currentTarget.style.color = "var(--electric-blue)"}
                        >
                            {part}
                        </Link>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </p>
    );
};

export default function CommunityFeed({ filter, titleOverride }: { filter?: FeedFilter, titleOverride?: string }) {
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addToast } = useToast();

    const handleLike = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const docRef = doc(db, "translations", id);
            await updateDoc(docRef, {
                likes: increment(1)
            });
            // We don't need a toast for every like to prevent spam, UI will update via onSnapshot
        } catch (error) {
            console.error("Error liking post:", error);
            addToast("Failed to like post.", "error");
        }
    };

    useEffect(() => {
        let q = query(
            collection(db, "translations"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        if (filter) {
            // If filtering, we must also orderBy the filtered field first per Firestore rules, or remove the ascending timestamp order
            // To keep it simple for now, we'll just filter without strict ordering if complex index doesn't exist, 
            // or we use simple query
            q = query(
                collection(db, "translations"),
                where(filter.field, filter.operator, filter.value),
                limit(20)
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const translations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If database is empty, fallback to mock data temporarily
            if (translations.length === 0) {
                setFeed(MOCK_FEED);
            } else {
                setFeed(translations);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching live feed:", error);
            setFeed(MOCK_FEED);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [filter]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--signal-white)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {titleOverride || "The Hall of Shame"}
                </h2>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>LIVE FEED</span>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflowY: "auto",
                paddingRight: "8px", // For scrollbar
                maxHeight: "800px" // Temporary max height, ideally handled by parent grid
            }}>
                {feed.map((item) => (
                    <div 
                        key={item.id} 
                        className="glass-panel" 
                        onClick={() => router.push(`/thread/${item.id}`)}
                        style={{ 
                            padding: "16px", display: "flex", flexDirection: "column", gap: "12px", 
                            border: `1px solid ${item.mode === 'hallucinate' ? 'rgba(255, 87, 34, 0.3)' : 'var(--glass-border)'}`,
                            cursor: "pointer", transition: "all 0.2s ease" 
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = item.mode === 'hallucinate' ? 'var(--warning-orange)' : 'var(--electric-blue)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = item.mode === 'hallucinate' ? 'rgba(255, 87, 34, 0.3)' : 'var(--glass-border)'}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: item.mode === 'hallucinate' ? "var(--warning-orange)" : "var(--electric-blue)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>
                                {item.mode === 'hallucinate' ? 'HALLUCINATION' : 'UN-GLOSSED'} • B.S. Score: {item.bsScore !== undefined ? `${item.bsScore}%` : 'N/A'}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }} suppressHydrationWarning>
                                {item.timestamp?.seconds
                                    ? new Date(item.timestamp.seconds * 1000).toLocaleDateString()
                                    : (item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Just now')}
                            </span>
                        </div>

                        <div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", marginBottom: "8px", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                "{item.originalText}"
                            </p>
                            <RichTextRenderer text={item.translation} />
                        </div>
                        
                        {/* Inline Actions */}
                        <div style={{ display: "flex", gap: "16px", marginTop: "4px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <button className="feed-action-btn" onClick={(e) => handleLike(e, item.id)}>
                                <FaBullhorn color={(item.likes || 0) > 0 ? "var(--warning-orange)" : "currentColor"} /> 
                                <span style={{fontSize: "0.8rem", fontWeight: "bold"}}>{item.likes || 0} I've Heard This</span>
                            </button>
                            <button className="feed-action-btn" onClick={(e) => { e.stopPropagation(); router.push(`/thread/${item.id}`); }}>
                                <FaCommentAlt /> <span style={{fontSize: "0.8rem"}}>Discuss</span>
                            </button>
                            <button className="feed-action-btn" onClick={(e) => { 
                                e.stopPropagation(); 
                                navigator.clipboard.writeText(`${window.location.origin}/thread/${item.id}`);
                                addToast("Thread link copied to clipboard!", "info");
                            }}>
                                <FaShare /> <span style={{fontSize: "0.8rem"}}>Share</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .feed-action-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    display: flex;
                    alignItems: center;
                    gap: 6px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                .feed-action-btn:hover {
                    color: var(--signal-white);
                    background: rgba(255,255,255,0.05);
                }
            `}} />

            {/* Live Google AdSense Slot */}
            <div className="glass-panel" style={{
                padding: "24px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed rgba(255,255,255,0.1)",
                backgroundColor: "rgba(0,0,0,0.2)"
            }}>
                <AdSenseWidget />
            </div>

        </div>
    );
}
