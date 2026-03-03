"use client";

import { useEffect, useState, FormEvent } from "react";
import { FaHistory, FaEnvelope } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/context/ToastContext";

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
    const { addToast } = useToast();

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
                padding: "20px",
                textAlign: "left",
                border: "1px solid var(--glass-border)",
                background: "rgba(0, 123, 255, 0.05)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <FaEnvelope style={{ color: "var(--electric-blue)" }} />
                    <h3 style={{ fontSize: "0.85rem", color: "var(--signal-white)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                        Jargon Buster Newsletter
                    </h3>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
                    Get our weekly dispatch. We dissect the newest corporate slang so you don't have to. No spam, just clarity.
                </p>
                <form 
                    onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem("email") as HTMLInputElement;
                        if (!input.value) return;
                        try {
                            await addDoc(collection(db, "newsletter_subs"), {
                                email: input.value,
                                source: "sidebar_widget",
                                timestamp: serverTimestamp()
                            });
                            input.value = "";
                            addToast("Successfully subscribed to the Jargon Buster.", "success");
                        } catch (err) {
                            console.error(err);
                            addToast("Failed to subscribe. Please try again.", "error");
                        }
                    }} 
                    style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                    <input 
                        type="email" 
                        name="email"
                        placeholder="your@email.com" 
                        required
                        className="glass-input"
                        style={{ padding: "8px 12px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                    />
                    <button 
                        type="submit" 
                        className="action-button btn-secondary"
                        style={{ padding: "8px", fontSize: "0.8rem", width: "100%", borderColor: "var(--electric-blue)" }}
                    >
                        SUBSCRIBE
                    </button>
                </form>
            </div>
        </div>
    );
}
