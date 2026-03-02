"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Stats {
    unglosses: number;
    pivots: number;
    hallucinations: number;
    totalWasted: number;
    moneySaved: number;
}

export default function StatsBar() {
    // Mock data for now until Firebase aggregation is implemented
    // Base mock data for visual impact, live data will aggregate on top of this
    const BASE_STATS = {
        unglosses: 12482,
        pivots: 8321,
        hallucinations: 4502,
        totalWasted: 1420500.50,
        moneySaved: 685400.00
    };

    const [stats, setStats] = useState<Stats>(BASE_STATS);

    useEffect(() => {
        const q = query(
            collection(db, "translations"),
            orderBy("timestamp", "asc") // Get all to aggregate live
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let u = BASE_STATS.unglosses;
            let p = BASE_STATS.pivots;
            let h = BASE_STATS.hallucinations;
            let tw = BASE_STATS.totalWasted;
            let ms = BASE_STATS.moneySaved;

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.mode === 'ungloss') u++;
                else if (data.mode === 'pivot') p++;
                else if (data.mode === 'hallucinate') h++;

                tw += (data.wastedCapital || 0);
                ms += (data.moneySaved || 0);
            });

            setStats({
                unglosses: u,
                pivots: p,
                hallucinations: h,
                totalWasted: tw,
                moneySaved: ms
            });
        });
        return () => unsubscribe();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <div className="glass-panel" style={{
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
            textAlign: "center",
            background: "var(--glass-bg)"
        }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Un-glosses</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--warning-orange)" }} suppressHydrationWarning>{formatNumber(stats.unglosses)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Professional Pivots</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--electric-blue)" }} suppressHydrationWarning>{formatNumber(stats.pivots)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hallucinations</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--signal-white)" }} suppressHydrationWarning>{formatNumber(stats.hallucinations)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>Capital Wasted</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--warning-orange)" }} suppressHydrationWarning>{formatCurrency(stats.totalWasted)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#4CAF50", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>Money Saved</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#4CAF50" }} suppressHydrationWarning>{formatCurrency(stats.moneySaved)}</span>
            </div>
        </div>
    );
}
