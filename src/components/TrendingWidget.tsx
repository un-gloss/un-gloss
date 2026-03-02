"use client";

import React, { useEffect, useState } from 'react';
import { FaFire, FaChartLine, FaGlobe } from 'react-icons/fa';
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from 'next/link';

interface TrendingCompany {
    name: string;
    bsScore: number;
    wastedCapital: string;
    trend: 'up' | 'down' | 'stable';
}

const MOCK_TRENDING: TrendingCompany[] = [
    { name: "Globex Corp", bsScore: 94, wastedCapital: "420,500", trend: 'up' },
    { name: "Synergy Logics", bsScore: 88, wastedCapital: "215,300", trend: 'up' },
    { name: "Veridian Dynamics", bsScore: 82, wastedCapital: "189,000", trend: 'stable' },
    { name: "Initech", bsScore: 76, wastedCapital: "142,000", trend: 'down' },
    { name: "Hooli", bsScore: 91, wastedCapital: "310,400", trend: 'up' },
];

export default function TrendingWidget() {
    const [trending, setTrending] = useState<TrendingCompany[]>(MOCK_TRENDING);
    const [viewMode, setViewMode] = useState<'corporations' | 'regions'>('corporations');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "translations"),
            orderBy("timestamp", "desc"),
            limit(200) // fetch recent translations to aggregate
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const translations = snapshot.docs.map(doc => doc.data());

            if (translations.length === 0) {
                setTrending(MOCK_TRENDING);
                setLoading(false);
                return;
            }

            // Aggregate
            const statsMap: Record<string, { count: number, totalBs: number, totalWasted: number }> = {};

            translations.forEach(t => {
                let key = "Unknown";

                if (viewMode === 'corporations') {
                    key = t.source || "Anonymous";
                    if (key === "Anonymous" || key === "Individual") return; // exclude
                } else {
                    key = t.country || "Unknown";
                    if (key === "Unknown") return; // exclude
                }

                if (!statsMap[key]) {
                    statsMap[key] = { count: 0, totalBs: 0, totalWasted: 0 };
                }
                statsMap[key].count += 1;
                statsMap[key].totalBs += (t.bsScore || 0);
                statsMap[key].totalWasted += (t.wastedCapital || 0);
            });

            const aggregated: TrendingCompany[] = Object.entries(statsMap).map(([name, stats]) => {
                return {
                    name,
                    bsScore: Math.round(stats.totalBs / stats.count),
                    wastedCapital: stats.totalWasted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                    trend: 'stable'
                };
            });

            aggregated.sort((a, b) => {
                const aWasted = parseInt(a.wastedCapital.replace(/,/g, ''));
                const bWasted = parseInt(b.wastedCapital.replace(/,/g, ''));
                return bWasted - aWasted;
            });

            if (aggregated.length > 0) {
                setTrending(aggregated.slice(0, 5));
            } else {
                setTrending(MOCK_TRENDING);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [viewMode]);

    return (
        <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaFire style={{ color: "var(--warning-orange)" }} />
                    <h3 style={{
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--signal-white)",
                        margin: 0
                    }}>
                        Trending Data
                    </h3>
                </div>
                <FaChartLine style={{ color: "var(--text-muted)", fontSize: "0.9rem" }} />
            </div>

            {/* Toggle Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" }}>
                <button
                    onClick={() => setViewMode('corporations')}
                    style={{
                        flex: 1, padding: "8px", background: "none", border: "none", cursor: "pointer",
                        color: viewMode === 'corporations' ? "var(--warning-orange)" : "var(--text-muted)",
                        borderBottom: viewMode === 'corporations' ? "2px solid var(--warning-orange)" : "2px solid transparent",
                        fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em",
                        transition: "all 0.2s"
                    }}
                >
                    Sources
                </button>
                <button
                    onClick={() => setViewMode('regions')}
                    style={{
                        flex: 1, padding: "8px", background: "none", border: "none", cursor: "pointer",
                        color: viewMode === 'regions' ? "var(--electric-blue)" : "var(--text-muted)",
                        borderBottom: viewMode === 'regions' ? "2px solid var(--electric-blue)" : "2px solid transparent",
                        fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        transition: "all 0.2s"
                    }}
                >
                    <FaGlobe /> Regions
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "250px" }}>
                {loading ? (
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "20px" }}>Aggregating live data...</div>
                ) : trending.map((company, index) => (
                    <div
                        key={company.name}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "30px 1fr auto",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px 0",
                            borderBottom: index !== trending.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                        }}
                    >
                        <span style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontWeight: "bold",
                            fontFamily: "var(--font-mono)"
                        }}>
                            #{index + 1}
                        </span>

                        <div>
                            <div style={{ fontSize: "0.9rem", color: "var(--signal-white)", fontWeight: "500" }}>
                                {company.name}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                Avg. B.S: <span style={{ color: company.bsScore > 85 ? "var(--warning-orange)" : "var(--electric-blue)" }}>{company.bsScore}%</span>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--signal-white)", fontWeight: "bold" }}>
                                ${company.wastedCapital}
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                                Wasted
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                textAlign: "center"
            }}>
                <Link href="/global-index" style={{
                    display: "inline-block",
                    textDecoration: "none",
                    color: "var(--electric-blue)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: "bold"
                }}>
                    View Global B.S. Index →
                </Link>
            </div>
        </div>
    );
}
