"use client";

import { useState } from "react";
import { FaTachometerAlt } from "react-icons/fa";

export interface TrustSection {
    title?: string;
    gloss: string;
    ungloss: string;
}

interface TrustPageTemplateProps {
    pageTitle: string;
    pageDescription: string;
    sections: TrustSection[];
    children?: React.ReactNode;
}

export default function TrustPageTemplate({ pageTitle, pageDescription, sections, children }: TrustPageTemplateProps) {
    const [jargonOn, setJargonOn] = useState(true);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "40px 24px" }}>
            <main style={{ maxWidth: "800px", margin: "0 auto", width: "100%", flex: 1 }}>
                
                {/* Header */}
                <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--glass-border)", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
                    <div>
                        <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0 0 8px 0", color: "var(--signal-white)" }}>
                            {pageTitle}
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
                            {pageDescription}
                        </p>
                    </div>

                    {/* The B.S. Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "12px 24px", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: jargonOn ? "var(--text-muted)" : "var(--warning-orange)", transition: "color 0.3s ease" }}>
                            <FaTachometerAlt size={20} color={jargonOn ? "var(--warning-orange)" : "var(--electric-blue)"} />
                            B.S. METER: {jargonOn ? "ON" : "OFF"}
                        </div>
                        
                        {/* Toggle Switch UI */}
                        <button 
                            onClick={() => setJargonOn(!jargonOn)}
                            aria-label="Toggle Jargon"
                            style={{
                                width: "48px",
                                height: "24px",
                                borderRadius: "12px",
                                background: jargonOn ? "var(--warning-orange)" : "var(--electric-blue)",
                                border: "none",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background 0.3s ease"
                            }}
                        >
                            <div style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "var(--obsidian)",
                                position: "absolute",
                                top: "3px",
                                left: jargonOn ? "27px" : "3px",
                                transition: "left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
                            }} />
                        </button>
                    </div>
                </div>

                {/* Content Sections */}
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {sections.map((section, idx) => (
                        <div key={idx} className="glass-panel" style={{ 
                            padding: "32px", 
                            background: jargonOn ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.03)",
                            borderLeft: jargonOn ? "1px solid var(--glass-border)" : "4px solid var(--electric-blue)",
                            transition: "all 0.3s ease"
                        }}>
                            {section.title && (
                                <h2 style={{ fontSize: "1.2rem", color: "var(--signal-white)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {section.title}
                                </h2>
                            )}
                            
                            <div style={{ position: "relative" }}>
                                {/* Dense Corporate Text (Gloss) */}
                                <div style={{
                                    opacity: jargonOn ? 1 : 0,
                                    height: jargonOn ? "auto" : 0,
                                    overflow: "hidden",
                                    color: "var(--text-muted)",
                                    fontSize: "1.1rem",
                                    lineHeight: "1.8",
                                    transition: "opacity 0.3s ease"
                                }}>
                                    {section.gloss}
                                </div>

                                {/* Surgical Realist Text (Un-gloss) */}
                                <div className="human-text" style={{
                                    opacity: jargonOn ? 0 : 1,
                                    height: jargonOn ? 0 : "auto",
                                    overflow: "hidden",
                                    color: "var(--signal-white)",
                                    fontSize: "1.4rem",
                                    lineHeight: "1.6",
                                    transition: "opacity 0.3s ease"
                                }}>
                                    {section.ungloss}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {children}

            </main>
        </div>
    );
}
