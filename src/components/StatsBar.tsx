"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Stats {
    unglosses: number;
    pivots: number;
    hallucinations: number;
    totalWasted: number;
    moneySaved: number;
}

// Custom animated counter to turn load delays into a feature
const AnimatedNumber = ({ value, format }: { value: number, format: (n: number) => string }) => {
    const [displayValue, setDisplayValue] = useState(0); 
    const prevValueRef = useRef(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1500; // 1.5s easing
        const startValue = prevValueRef.current;
        const targetValue = value;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const current = startValue + (targetValue - startValue) * easeProgress;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setDisplayValue(targetValue);
                prevValueRef.current = targetValue;
            }
        };

        const rAF = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rAF);
    }, [value]);

    return <span suppressHydrationWarning>{format(displayValue)}</span>;
};

export default function StatsBar() {
    // Mock data for now until Firebase aggregation is implemented
    // Base mock data for visual impact, live data will aggregate on top of this
    const BASE_STATS = {
        unglosses: 0,
        pivots: 0,
        hallucinations: 0,
        totalWasted: 0,
        moneySaved: 0
    };

    const [stats, setStats] = useState<Stats>(BASE_STATS);
    const [isLive, setIsLive] = useState(false);

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

                tw += parseFloat(`${data.wastedCapital || 0}`);
                ms += parseFloat(`${data.moneySaved || 0}`);
            });

            setStats({
                unglosses: u,
                pivots: p,
                hallucinations: h,
                totalWasted: tw,
                moneySaved: ms
            });
            setIsLive(true);
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
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--glass-bg)",
            position: "relative"
        }}>
            {/* Live Indicator */}
            <div style={{ position: "absolute", top: "12px", right: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: isLive ? "#4CAF50" : "var(--warning-orange)",
                    boxShadow: isLive ? "0 0 8px #4CAF50" : "none",
                    animation: isLive ? "pulse 2s infinite" : "none"
                }} />
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {isLive ? "SYNCED" : "AGGREGATING..."}
                </span>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "20px",
                textAlign: "center",
                marginTop: "12px"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Un-glosses</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--warning-orange)", fontFamily: "'Roboto Mono', monospace" }}>
                        <AnimatedNumber value={stats.unglosses} format={formatNumber} />
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Professional Pivots</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--electric-blue)", fontFamily: "'Roboto Mono', monospace" }}>
                        <AnimatedNumber value={stats.pivots} format={formatNumber} />
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hallucinations</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--signal-white)", fontFamily: "'Roboto Mono', monospace" }}>
                        <AnimatedNumber value={stats.hallucinations} format={formatNumber} />
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>Capital Wasted</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--warning-orange)", fontFamily: "'Roboto Mono', monospace" }}>
                        <AnimatedNumber value={stats.totalWasted} format={formatCurrency} />
                    </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#4CAF50", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>Money Saved</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#4CAF50", fontFamily: "'Roboto Mono', monospace" }}>
                        <AnimatedNumber value={stats.moneySaved} format={formatCurrency} />
                    </span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
            `}} />
        </div>
    );
}
