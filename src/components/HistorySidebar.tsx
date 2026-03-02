"use client";

import { useEffect, useState } from "react";
import { FaHistory, FaBookmark } from "react-icons/fa";

interface HistoryItem {
    id: string;
    text: string;
    mode: "ungloss" | "pivot" | "hallucinate";
    timestamp: string;
}

const MOCK_HISTORY: HistoryItem[] = [
    {
        id: "h1",
        text: "Let's touch base on the mission-critical deliverables.",
        mode: "ungloss",
        timestamp: "2026-03-01T10:00:00Z"
    },
    {
        id: "h2",
        text: "I am very busy right now.",
        mode: "pivot",
        timestamp: "2026-03-01T09:30:00Z"
    },
    {
        id: "h3",
        text: "The coffee machine is broken.",
        mode: "hallucinate",
        timestamp: "2026-03-01T08:15:00Z"
    }
];

export default function HistorySidebar() {
    const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaHistory style={{ color: "var(--warning-orange)", fontSize: "1.1rem" }} />
                <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--signal-white)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Your Archive
                </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                    RECENT SESSIONS
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="glass-panel"
                            style={{
                                padding: "12px",
                                cursor: "pointer",
                                border: "1px solid var(--glass-border)",
                                transition: "all 0.2s ease",
                                background: "rgba(255, 255, 255, 0.02)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--warning-orange)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--glass-border)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                            }}
                        >
                            <p style={{
                                fontSize: "0.85rem",
                                color: "var(--signal-white)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "4px"
                            }}>
                                {item.text}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{
                                    fontSize: "0.65rem",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    fontWeight: "bold"
                                }}>
                                    {item.mode}
                                </span>
                                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }} suppressHydrationWarning>
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{
                marginTop: "auto",
                padding: "16px",
                textAlign: "center",
                border: "1px solid var(--glass-border)",
                background: "rgba(0, 123, 255, 0.05)"
            }}>
                <FaBookmark style={{ color: "var(--electric-blue)", marginBottom: "8px" }} />
                <p style={{ fontSize: "0.8rem", color: "var(--signal-white)", fontWeight: "bold" }}>PRO TIP</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Login to sync your archive across devices.
                </p>
            </div>
        </div>
    );
}
