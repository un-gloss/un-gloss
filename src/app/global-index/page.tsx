"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { FaFire, FaGlobe, FaArrowLeft } from 'react-icons/fa';
import AmbientBackground from "@/components/AmbientBackground";

interface AggregatedStats {
    name: string;
    bsScore: number;
    wastedCapital: number;
    count: number;
}

export default function GlobalIndexPage() {
    const [sources, setSources] = useState<AggregatedStats[]>([]);
    const [regions, setRegions] = useState<AggregatedStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "translations"),
            orderBy("timestamp", "desc"),
            limit(1000) // fetch more for the full page
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const translations = snapshot.docs.map(doc => doc.data());

            if (translations.length === 0) {
                setLoading(false);
                return;
            }

            const sourceMap: Record<string, AggregatedStats> = {};
            const regionMap: Record<string, AggregatedStats> = {};

            translations.forEach(t => {
                const sourceName = t.source || "Anonymous";
                const regionName = t.country || "Unknown";

                if (sourceName !== "Anonymous" && sourceName !== "Individual") {
                    if (!sourceMap[sourceName]) sourceMap[sourceName] = { name: sourceName, bsScore: 0, wastedCapital: 0, count: 0 };
                    sourceMap[sourceName].count += 1;
                    sourceMap[sourceName].bsScore += (t.bsScore || 0);
                    sourceMap[sourceName].wastedCapital += (t.wastedCapital || 0);
                }

                if (regionName !== "Unknown") {
                    if (!regionMap[regionName]) regionMap[regionName] = { name: regionName, bsScore: 0, wastedCapital: 0, count: 0 };
                    regionMap[regionName].count += 1;
                    regionMap[regionName].bsScore += (t.bsScore || 0);
                    regionMap[regionName].wastedCapital += (t.wastedCapital || 0);
                }
            });

            const formatData = (map: Record<string, AggregatedStats>) => {
                return Object.values(map).map(stats => ({
                    ...stats,
                    bsScore: Math.round(stats.bsScore / stats.count)
                })).sort((a, b) => b.wastedCapital - a.wastedCapital); // Sort by highest capital wasted
            };

            setSources(formatData(sourceMap));
            setRegions(formatData(regionMap));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const TableRow = ({ item, index }: { item: AggregatedStats, index: number }) => (
        <div className="leaderboard-row" style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 120px 150px",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"
        }}>
            <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
                #{index + 1}
            </span>
            <div style={{ fontSize: "1.2rem", color: "var(--signal-white)", fontWeight: "500" }}>
                {item.name}
            </div>
            <div className="score-col" style={{ textAlign: "right", fontSize: "1rem", color: item.bsScore > 85 ? "var(--warning-orange)" : "var(--electric-blue)" }}>
                {item.bsScore}% B.S.
            </div>
            <div style={{ textAlign: "right", fontSize: "1.3rem", color: "var(--warning-orange)", fontWeight: "bold" }}>
                ${item.wastedCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
        </div>
    );

    return (
        <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
            <AmbientBackground />

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

                <div style={{ marginBottom: "40px", display: "flex", alignItems: "center" }}>
                    <Link href="/" style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        transition: "color 0.2s"
                    }}
                        onMouseOver={(e) => e.currentTarget.style.color = "var(--signal-white)"}
                        onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                </div>

                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h1 className="hero-title" style={{ fontSize: "3.5rem", marginBottom: "16px" }}>
                        Global <span style={{ color: "var(--warning-orange)" }}>B.S. Index</span>
                    </h1>
                    <p className="hero-subtitle" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        Real-time tracking of the world's most egregiously confusing corporate entities and regions, ranked by estimated capital wasted.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", color: "var(--electric-blue)", fontSize: "1.2rem", padding: "40px" }}>
                        Aggregating global datasets...
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "40px" }}>

                        {/* Sources Leaderboard */}
                        <div className="glass-panel" style={{ padding: "0", overflow: "hidden" }}>
                            <div style={{
                                padding: "24px",
                                background: "rgba(0,0,0,0.4)",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <FaFire style={{ color: "var(--warning-orange)", fontSize: "1.8rem" }} />
                                <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    Top Offending Sources
                                </h2>
                            </div>

                            <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                                {sources.length > 0 ? sources.map((item, index) => (
                                    <TableRow key={item.name} item={item} index={index} />
                                )) : (
                                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No source data available yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Regions Leaderboard */}
                        <div className="glass-panel" style={{ padding: "0", overflow: "hidden" }}>
                            <div style={{
                                padding: "24px",
                                background: "rgba(0,0,0,0.4)",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <FaGlobe style={{ color: "var(--electric-blue)", fontSize: "1.8rem" }} />
                                <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    Foggiest Regions
                                </h2>
                            </div>

                            <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                                {regions.length > 0 ? regions.map((item, index) => (
                                    <TableRow key={item.name} item={item} index={index} />
                                )) : (
                                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No regional data available yet.</div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* CSS for responsive queries on the page itself */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1200px) {
                    .hero-title { font-size: 2.8rem !important; }
                }
                @media (max-width: 700px) {
                    .hero-title { font-size: 2.2rem !important; }
                    .leaderboard-row {
                        grid-template-columns: 40px 1fr auto !important;
                        gap: 12px !important;
                        padding: 16px !important;
                    }
                    .score-col {
                         display: none !important; /* hide bs score on mobile */
                    }
                }
            `}} />
        </main>
    );
}
