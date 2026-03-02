"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function CommunityFeed() {
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "translations"),
            orderBy("timestamp", "desc"),
            limit(20)
        );
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
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--signal-white)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    The Hall of Shame
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
                    <div key={item.id} className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid var(--glass-border)" }}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>
                                B.S. Score: {item.bsScore !== undefined ? `${item.bsScore}%` : 'N/A'}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }} suppressHydrationWarning>
                                {item.timestamp?.seconds
                                    ? new Date(item.timestamp.seconds * 1000).toLocaleDateString()
                                    : (item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Just now')}
                            </span>
                        </div>

                        <div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", marginBottom: "8px", fontStyle: "italic" }}>
                                "{item.originalText}"
                            </p>
                            <p className="human-text" style={{ fontSize: "1rem" }}>
                                {item.translation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AdSense Placeholder */}
            <div className="glass-panel" style={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed var(--text-muted)",
                backgroundColor: "rgba(0,0,0,0.2)"
            }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>[ Ad Space ]</span>
            </div>

        </div>
    );
}
