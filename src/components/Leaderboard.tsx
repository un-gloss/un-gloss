"use client";

import { useState, useEffect } from "react";

type LeaderboardEntry = {
    ceoName: string;
    quote: string;
    densityScore: number;
};

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/leaderboard");
            if (!response.ok) throw new Error("Failed to fetch leaderboard");
            const data = await response.json();
            setEntries(data.entries);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className="card" style={{ padding: "0" }}>
            <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "4px solid var(--border-color)" }}>
                <h3>LIVE GENERATED</h3>
                <button
                    onClick={fetchLeaderboard}
                    disabled={isLoading}
                    style={{ padding: "8px 16px", fontSize: "1rem" }}
                >
                    {isLoading ? "..." : "REFRESH"}
                </button>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="leaderboard-table" style={{ marginTop: 0, borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
                    <thead>
                        <tr>
                            <th style={{ borderLeft: "none", borderTop: "none" }}>CEO</th>
                            <th style={{ borderTop: "none" }}>QUOTE</th>
                            <th style={{ borderRight: "none", borderTop: "none", textAlign: "right" }}>BUZZWORD DENSITY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center", padding: "40px" }}>GENERATING HALL OF SHAME...</td>
                            </tr>
                        ) : entries.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ borderLeft: "none", fontWeight: "bold" }}>{entry.ceoName}</td>
                                <td style={{ fontStyle: "italic" }}>&quot;{entry.quote}&quot;</td>
                                <td style={{ borderRight: "none", textAlign: "right", fontWeight: "bold", color: "var(--primary-accent)", fontSize: "1.2rem" }}>
                                    {entry.densityScore}/100
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
