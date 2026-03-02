"use client";

import React from 'react';

interface ShareCardProps {
    originalText: string;
    translatedText: string;
    mode: string;
    bsScore: number | null;
    costOfConfusion: string | null;
    moneySaved: string | null;
}

const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(({
    originalText,
    translatedText,
    mode,
    bsScore,
    costOfConfusion,
    moneySaved
}, ref) => {

    const isUngloss = mode === "ungloss";
    const accentColor = isUngloss ? "var(--warning-orange)" : "var(--electric-blue)";

    return (
        <div
            ref={ref}
            style={{
                width: "600px",
                padding: "40px",
                background: "linear-gradient(135deg, #0a0a0b 0%, #161618 100%)",
                color: "white",
                fontFamily: "var(--font-inter), sans-serif",
                position: "relative",
                overflow: "hidden",
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                display: "flex",
                flexDirection: "column",
                gap: "24px"
            }}
        >
            {/* Ambient Blobs */}
            <div style={{
                position: "absolute",
                top: "-50px",
                left: "-50px",
                width: "200px",
                height: "200px",
                background: accentColor,
                filter: "blur(100px)",
                opacity: 0.15,
                zIndex: 0
            }} />

            {/* Logo Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    <span style={{ color: accentColor }}>U/</span> Un-gloss
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px" }}>
                    un-gloss.com
                </div>
            </div>

            {/* Original Text (The Fog) */}
            <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>
                    // The Fog
                </div>
                <div style={{
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.8)",
                    fontStyle: "italic",
                    background: "rgba(255,255,255,0.03)",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.05)"
                }}>
                    "{originalText.length > 150 ? originalText.substring(0, 150) + "..." : originalText}"
                </div>
            </div>

            {/* Arrow */}
            <div style={{ textAlign: "center", color: accentColor, fontSize: "1.5rem", zIndex: 1 }}>
                ↓
            </div>

            {/* Transformed Text (The Truth) */}
            <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: accentColor, marginBottom: "8px", textTransform: "uppercase", fontWeight: "bold" }}>
                    // {isUngloss ? "The Truth" : "The Polish"}
                </div>
                <div style={{
                    fontSize: "1.2rem",
                    color: "white",
                    fontWeight: "500",
                    lineHeight: "1.5"
                }}>
                    {translatedText}
                </div>
            </div>

            {/* Stats Footer */}
            <div style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: moneySaved ? "1fr 1fr 1fr" : "1fr 1.2fr",
                gap: "12px",
                zIndex: 1
            }}>
                {bsScore !== null && (
                    <div style={{
                        background: "rgba(255,255,255,0.03)",
                        padding: "16px",
                        borderRadius: "12px",
                        border: `1px solid ${bsScore > 50 ? 'rgba(255, 87, 34, 0.2)' : 'rgba(0, 123, 255, 0.2)'}`
                    }}>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>B.S. METER</div>
                        <div style={{ fontSize: moneySaved ? "1.2rem" : "1.5rem", fontWeight: "bold", color: bsScore > 50 ? "var(--warning-orange)" : "var(--electric-blue)" }}>
                            {bsScore}%
                        </div>
                    </div>
                )}

                {costOfConfusion !== null && (
                    <div style={{
                        background: "rgba(255, 87, 34, 0.1)",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 87, 34, 0.3)"
                    }}>
                        <div style={{ fontSize: "0.6rem", color: "var(--warning-orange)", marginBottom: "4px" }}>CAPITAL WASTED</div>
                        <div style={{ fontSize: moneySaved ? "1.2rem" : "1.5rem", fontWeight: "bold", color: "white" }}>
                            ${costOfConfusion}
                        </div>
                    </div>
                )}

                {moneySaved !== null && (
                    <div style={{
                        background: "rgba(76, 175, 80, 0.1)",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(76, 175, 80, 0.3)"
                    }}>
                        <div style={{ fontSize: "0.6rem", color: "#4CAF50", marginBottom: "4px" }}>MONEY SAVED</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
                            ${moneySaved}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "10px", zIndex: 1 }}>
                Stop the corporate fog. Get clear at <strong>un-gloss.com</strong>
            </div>
        </div>
    );
});

ShareCard.displayName = "ShareCard";

export default ShareCard;
