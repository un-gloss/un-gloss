"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaLinkedinIn, FaRedditAlien, FaFacebookF, FaInstagram, FaDownload, FaTimes, FaClipboard } from "react-icons/fa";
import { toPng } from "html-to-image";
import ShareCard from "./ShareCard";

type TranslationMode = "ungloss" | "pivot" | "hallucinate";

export default function TranslationDeck() {
    const [input, setInput] = useState("");
    const [source, setSource] = useState("");
    const [translation, setTranslation] = useState("");
    const [bsScore, setBsScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeMode, setActiveMode] = useState<TranslationMode>("ungloss");
    const [toneIntensity, setToneIntensity] = useState<number>(0);
    const [costOfConfusion, setCostOfConfusion] = useState<string | null>(null);
    const [moneySaved, setMoneySaved] = useState<string | null>(null);
    const [wordStats, setWordStats] = useState<{ original: number; target: number; isDocument: boolean } | null>(null);
    const [isSourceFocused, setIsSourceFocused] = useState(false);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const sourceTags = [
        "BigTech", "MiddleManagement", "Recruiting", "VentureCapital", 
        "Consulting", "Marketing", "Legal", "HumanResources", 
        "ExecutiveSuite", "StartupFounder", "AgileCoach", "Big4", "AccountingFirm"
    ];

    const filteredTags = sourceTags.filter(tag => 
        tag.toLowerCase().includes(source.toLowerCase().replace('#', ''))
    );

    const placeholders = [
        "Let's touch base on the mission-critical deliverables...",
        "We need to synergize our cross-functional bandwidth...",
        "Let's take this offline and circle back next week...",
        "We are shifting the paradigm with scalable solutions...",
        "I don't have the bandwidth for this right now...",
        "Let's open the kimono and look at the raw data...",
        "We need to boil the ocean to find the right metrics..."
    ];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // Dynamic Placeholder Rotation
    useEffect(() => {
        if (!input) {
            const interval = setInterval(() => {
                setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [input, placeholders.length]);

    // Automatically reset the output when the user types new text
    useEffect(() => {
        if (translation) {
            setTranslation("");
            setBsScore(null);
            setCostOfConfusion(null);
            setMoneySaved(null);
            setWordStats(null);
        }
    }, [input, source]);

    const handleTranslate = async (mode: TranslationMode) => {
        if (!input.trim()) return;
        setIsLoading(true);
        setTranslation("");
        setBsScore(null);
        setCostOfConfusion(null);
        setMoneySaved(null);
        setWordStats(null);
        setActiveMode(mode);

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input, source: source, mode: mode, toneIntensity: toneIntensity }),
            });

            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            setTranslation(data.translation);
            if (data.bsScore !== undefined) {
                setBsScore(data.bsScore);
            }

            if (data.originalWordCount !== undefined) {
                setWordStats({
                    original: data.originalWordCount,
                    target: data.targetWordCount,
                    isDocument: data.isDocument
                });
            }

            // Calculate Cost of Confusion
            // Formula: Words * 0.5 mins * $1.00 (avg exec salary per minute)
            const textToCalculate = data.isDocument ? input : (mode === "ungloss" ? input : data.translation);
            const wordCount = textToCalculate.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
            const wastedMoney = (wordCount * 0.5 * 1.0).toFixed(2);
            setCostOfConfusion(wastedMoney);

            let moneySavedValue = 0;
            if (data.originalWordCount !== undefined && data.targetWordCount !== undefined) {
                if (data.originalWordCount > data.targetWordCount) {
                    const savedWords = data.originalWordCount - data.targetWordCount;
                    const saved = (savedWords * 0.5 * 1.0).toFixed(2);
                    setMoneySaved(saved);
                    moneySavedValue = parseFloat(saved);
                }
            }

            // Fetch generic geolocation for regional statistics
            let country = "Unknown";
            try {
                const geoResponse = await fetch('https://ipapi.co/json/');
                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    country = geoData.country_name || "Unknown";
                }
            } catch (e) {
                console.warn("Geolocation failing silently.", e);
            }

            // Save to Firebase (Fire and forget, so it doesn't block UI if unconfigured)
            addDoc(collection(db, "translations"), {
                originalText: input,
                source: data.standardizedSource || source || "Anonymous",
                translation: data.translation,
                bsScore: data.bsScore || 0,
                mode: mode,
                wastedCapital: parseFloat(wastedMoney) || 0,
                moneySaved: moneySavedValue,
                country: country,
                timestamp: serverTimestamp()
            }).catch(fbError => {
                console.warn("Firebase not configured or failed to save:", fbError);
            });

        } catch (error) {
            console.error(error);
            setTranslation("Error: Incapable of parsing input.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setInput("");
        setTranslation("");
    };

    const handleAutoPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setInput(text);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            alert("Clipboard access denied or empty.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(translation);
        alert("Copied to clipboard.");
    };

    const handleSocialShare = (platform: "linkedin" | "reddit" | "facebook" | "instagram") => {
        const actionText = activeMode === "ungloss" ? "Un-glosssed" : "Professionally Pivoted";
        const shareText = `"${input}"\n\n${actionText}:\n${translation}\n\nVia @UnglossApp (un-gloss.com)`;
        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent("https://un-gloss.com"); // Using the planned domain

        // Copy to clipboard universally as a backup
        navigator.clipboard.writeText(shareText);

        if (platform === "linkedin") {
            const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
            window.open(linkedinUrl, "_blank");
        } else if (platform === "reddit") {
            // Reddit allows prefilling title and URL
            const redditUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
            window.open(redditUrl, "_blank");
        } else if (platform === "facebook") {
            // Facebook mostly ignores text parameters in favor of OpenGraph tags on the URL itself
            // But we will copy the text to their clipboard and open the share dialog
            alert("Translation copied! Paste it into your Facebook post.");
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            window.open(fbUrl, "_blank");
        } else if (platform === "instagram") {
            // Instagram does not have a web-based share URL for pre-filling text.
            alert("Translation copied! Open Instagram on your phone to paste this into your story or feed.");
        }
    };

    const handleDownloadCard = async () => {
        if (shareCardRef.current === null) return;

        try {
            const dataUrl = await toPng(shareCardRef.current, { cacheBust: true });
            const link = document.createElement('a');
            link.download = `ungloss-score-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image:', err);
            alert("Failed to generate score card. Please try again.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>

            {/* The Pivot (Action Tab Bar) - Moved above input for better desktop flow, sticky bottom on mobile */}
            <div className="tab-bar-container">
                <button
                    className={`action-button btn-ungloss ${activeMode === 'ungloss' && translation ? 'active' : ''}`}
                    onClick={() => handleTranslate("ungloss")}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading && activeMode === 'ungloss' ? "ANALYZING..." : "UN-GLOSS"}
                </button>

                <button
                    className={`action-button btn-pivot ${activeMode === 'pivot' && translation ? 'active' : ''}`}
                    onClick={() => handleTranslate("pivot")}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading && activeMode === 'pivot' ? "PIVOTING..." : "PROFESSIONAL PIVOT"}
                </button>

                <button
                    className={`action-button btn-secondary ${activeMode === 'hallucinate' && translation ? 'active' : ''}`}
                    onClick={() => handleTranslate("hallucinate")}
                    disabled={isLoading || !input.trim()}
                    style={{
                        borderColor: activeMode === 'hallucinate' && translation ? "var(--warning-orange)" : "var(--glass-border)",
                    }}
                >
                    {isLoading && activeMode === 'hallucinate' ? "HALLUCINATING..." : "HALLUCINATE"}
                </button>
            </div>

            {/* The Fog (Input Pane) */}
            <div className="glass-panel peeled-corner" style={{ position: "relative" }}>

                {/* Feature: B.S. Meter */}
                {translation && bsScore !== null && (
                    <div className="deblur-effect" style={{
                        position: "absolute",
                        top: "-20px",
                        right: "40px",
                        background: "var(--obsidian-light)",
                        border: "1px solid var(--glass-border)",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        zIndex: 10
                    }}>
                        <span style={{ color: "var(--text-muted)" }}>B.S. METER:</span>
                        <span style={{
                            color: bsScore > 75 ? "var(--warning-orange)" : bsScore > 40 ? "yellow" : "var(--electric-blue)",
                            fontSize: "1rem"
                        }}>
                            {bsScore}%
                        </span>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>// Input (The Fog)</span>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button 
                            onClick={handleAutoPaste}
                            style={{ background: "transparent", border: "none", color: "var(--electric-blue)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", textTransform: "uppercase", fontWeight: "bold" }}
                        >
                            <FaClipboard /> Paste
                        </button>
                        {input && (
                            <button 
                                onClick={handleClear}
                                style={{ background: "transparent", border: "none", color: "var(--warning-orange)", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", textTransform: "uppercase", fontWeight: "bold" }}
                            >
                                <FaTimes /> Clear
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ position: "relative" }}>
                    <textarea
                        className="glass-input"
                        rows={5}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ position: "relative", zIndex: 2, background: input ? "rgba(255, 255, 255, 0.05)" : "transparent" }}
                    />
                    {!input && (
                        <div
                            onClick={() => setInput(placeholders[placeholderIndex])}
                            style={{
                                position: "absolute",
                                top: "16px",
                                left: "16px",
                                right: "16px",
                                color: "var(--text-muted)",
                                opacity: 0.6,
                                pointerEvents: "auto",
                                cursor: "pointer",
                                transition: "opacity 0.3s ease",
                                zIndex: 1
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                        >
                            {placeholders[placeholderIndex]}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: "16px", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>// The Source</span>
                    </div>
                    
                    <div style={{ position: "relative" }}>
                        <span style={{ 
                            position: "absolute", 
                            left: "16px", 
                            top: "50%", 
                            transform: "translateY(-50%)", 
                            color: "var(--electric-blue)", 
                            fontWeight: "bold",
                            pointerEvents: "none",
                            zIndex: 3
                        }}>#</span>
                        <input
                            className="glass-input"
                            type="text"
                            style={{ padding: "10px 16px 10px 32px", position: "relative", zIndex: 2, background: "rgba(255, 255, 255, 0.02)" }}
                            placeholder='Search or define the source (e.g., BigTech)'
                            value={source.replace('#', '')}
                            onChange={(e) => setSource(e.target.value)}
                            onFocus={() => setIsSourceFocused(true)}
                            onBlur={() => setTimeout(() => setIsSourceFocused(false), 200)} // Delay to allow click
                        />
                    </div>
                    
                    {isSourceFocused && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "8px",
                            background: "var(--obsidian)",
                            border: "1px solid var(--electric-blue)",
                            borderRadius: "8px",
                            padding: "8px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
                            zIndex: 20,
                            maxHeight: "150px",
                            overflowY: "auto"
                        }}>
                            {filteredTags.length > 0 ? (
                                filteredTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            setSource(`#${tag}`);
                                            setIsSourceFocused(false);
                                        }}
                                        style={{
                                            background: source === `#${tag}` ? "var(--electric-blue)" : "rgba(0, 123, 255, 0.1)",
                                            color: source === `#${tag}` ? "var(--signal-white)" : "var(--electric-blue)",
                                            border: "1px solid var(--electric-blue)",
                                            padding: "4px 12px",
                                            borderRadius: "16px",
                                            fontSize: "0.75rem",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (source !== `#${tag}`) {
                                                e.currentTarget.style.background = "rgba(0, 123, 255, 0.2)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (source !== `#${tag}`) {
                                                e.currentTarget.style.background = "rgba(0, 123, 255, 0.1)";
                                            }
                                        }}
                                    >
                                        #{tag}
                                    </button>
                                ))
                            ) : (
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "4px 8px" }}>
                                    Press enter to create custom tag: #{source.replace('#', '')}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Feature: Passive-Aggressive Slider (Only for Pivot) */}
                    {activeMode === "pivot" && (
                        <div style={{ padding: "16px 0 0 0", marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <label style={{ fontSize: "0.85rem", color: "var(--signal-white)" }}>Tonal Intensity (Polite ➜ Passive-Aggressive)</label>
                                <span style={{ fontSize: "0.85rem", color: "var(--electric-blue)", fontWeight: "bold" }}>{toneIntensity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={toneIntensity}
                                onChange={(e) => setToneIntensity(parseInt(e.target.value))}
                                onMouseUp={() => {
                                    if (translation && activeMode === "pivot") {
                                        handleTranslate("pivot");
                                    }
                                }}
                                onTouchEnd={() => {
                                    if (translation && activeMode === "pivot") {
                                        handleTranslate("pivot");
                                    }
                                }}
                                style={{
                                    width: "100%",
                                    accentColor: "var(--electric-blue)",
                                    cursor: "pointer"
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* The Clarity (Output Pane) */}
            <div
                className={`glass-panel peeled-corner ${translation ? 'deblur-effect' : ''}`}
                key={translation ? translation.substring(0, 10) : 'empty'} // Force re-render animation
                style={{
                    background: "var(--obsidian)",
                    border: translation ? `1px solid ${activeMode === 'ungloss' ? 'var(--warning-orange)' : 'var(--electric-blue)'}` : "1px solid var(--glass-border)",
                    opacity: translation ? 1 : 0.4,
                    minHeight: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}
            >
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", alignItems: "center" }}>
                        <span style={{
                            color: translation ? (activeMode === 'ungloss' ? "var(--warning-orange)" : "var(--electric-blue)") : "var(--text-muted)",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: translation ? "bold" : "normal"
                        }}>
              // {activeMode === 'ungloss' ? 'The Truth' : 'The Polish'}
                        </span>
                    </div>

                    <p className={activeMode === 'ungloss' ? "human-text" : "corporate-text"} style={{ whiteSpace: "pre-wrap", fontWeight: translation ? "600" : "normal" }}>
                        {translation || "Awaiting input..."}
                    </p>
                </div>

                {/* Feature: Word Economy (Phase 2 / Phase 4 tweaks) */}
                {translation && wordStats && wordStats.original > 0 && (
                    <div style={{
                        marginTop: "16px",
                        padding: "16px",
                        background: activeMode === 'hallucinate' ? "rgba(255, 87, 34, 0.05)" : "rgba(0, 123, 255, 0.05)",
                        borderLeft: `4px solid ${activeMode === 'hallucinate' ? 'var(--warning-orange)' : 'var(--electric-blue)'}`,
                        borderRadius: "0 8px 8px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.8rem", color: activeMode === 'hallucinate' ? "var(--warning-orange)" : "var(--electric-blue)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                                {activeMode === 'hallucinate' ? 'Capital Destruction' : 'Word Economy'}
                            </span>
                            {activeMode !== 'hallucinate' && wordStats.original > wordStats.target && (
                                <span style={{ fontSize: "0.75rem", background: "var(--electric-blue)", color: "white", padding: "2px 8px", borderRadius: "10px" }}>
                                    {Math.round((1 - wordStats.target / wordStats.original) * 100)}% SAVED
                                </span>
                            )}
                        </div>
                        
                        {activeMode === 'hallucinate' ? (
                            <>
                                <span style={{ color: "var(--signal-white)", fontSize: "0.95rem" }}>
                                    You just wasted <strong style={{ color: "var(--warning-orange)" }}>{((wordStats.target * 0.5) / 60).toFixed(2)} hours</strong> translating meaningless jargon into <strong style={{ color: "var(--warning-orange)" }}>{wordStats.target}</strong> words of more meaningless jargon.
                                </span>
                                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                    That's approximately ${costOfConfusion} of company money burned.
                                </div>
                            </>
                        ) : (
                            <>
                                <span style={{ color: "var(--signal-white)", fontSize: "0.95rem" }}>
                                    {wordStats.isDocument ? `Extracted ${wordStats.original} words.` : `Input: ${wordStats.original} words.`}
                                    {" "}Summarized to <strong style={{ color: "var(--electric-blue)" }}>{wordStats.target}</strong> words.
                                </span>
                                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                    {Math.round((1 - wordStats.target / wordStats.original) * 100) > 50
                                        ? "This could have been said in less than half the words."
                                        : "Cognitive load significantly reduced."}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Feature: Cost of Confusion */}
                {translation && costOfConfusion !== null && (
                    <div style={{
                        marginTop: "12px",
                        padding: "16px",
                        background: "rgba(255, 87, 34, 0.05)",
                        borderLeft: "4px solid var(--warning-orange)",
                        borderRadius: "0 8px 8px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                            Cost of Confusion
                        </span>
                        <span style={{ color: "var(--signal-white)", fontSize: "0.95rem" }}>
                            This message wasted approximately <strong style={{ color: "var(--warning-orange)", fontSize: "1.1rem" }}>${costOfConfusion}</strong> in company time.
                        </span>
                    </div>
                )}

                {/* Feature: Money Saved / ROI */}
                {translation && moneySaved !== null && (
                    <div style={{
                        marginTop: "12px",
                        padding: "16px",
                        background: "rgba(76, 175, 80, 0.05)",
                        borderLeft: "4px solid #4CAF50",
                        borderRadius: "0 8px 8px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}>
                        <span style={{ fontSize: "0.8rem", color: "#4CAF50", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                            Money Saved / ROI
                        </span>
                        <span style={{ color: "var(--signal-white)", fontSize: "0.95rem" }}>
                            Speaking simply just saved <strong style={{ color: "#4CAF50", fontSize: "1.1rem" }}>${moneySaved}</strong> in company time.
                        </span>
                    </div>
                )}

                {translation && (
                    <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                className="action-button btn-secondary"
                                onClick={handleCopy}
                                style={{ fontSize: "0.8rem", padding: "8px 16px" }}
                            >
                                COPY TEXT
                            </button>
                            <button
                                className="action-button"
                                onClick={handleDownloadCard}
                                aria-label={`Download image for ${source || "Jargon"} translation`}
                                style={{
                                    fontSize: "0.8rem",
                                    padding: "8px 16px",
                                    border: "1px solid var(--warning-orange)",
                                    color: "var(--warning-orange)",
                                    background: "rgba(255, 87, 34, 0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <FaDownload size={14} /> DOWNLOAD CARD
                            </button>
                        </div>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Share:</span>

                            {/* Social Icons Container */}
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={() => handleSocialShare("linkedin")}
                                    style={{
                                        background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "50%",
                                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--signal-white)", cursor: "pointer", transition: "all 0.2s ease"
                                    }}
                                    title="Share to LinkedIn"
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--electric-blue)"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
                                >
                                    <FaLinkedinIn size={16} />
                                </button>

                                <button
                                    onClick={() => handleSocialShare("reddit")}
                                    style={{
                                        background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "50%",
                                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--signal-white)", cursor: "pointer", transition: "all 0.2s ease"
                                    }}
                                    title="Share to Reddit"
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#FF4500"} // Reddit Orange
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
                                >
                                    <FaRedditAlien size={16} />
                                </button>

                                <button
                                    onClick={() => handleSocialShare("facebook")}
                                    style={{
                                        background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "50%",
                                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--signal-white)", cursor: "pointer", transition: "all 0.2s ease"
                                    }}
                                    title="Share to Facebook"
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#1877F2"} // Facebook Blue
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
                                >
                                    <FaFacebookF size={16} />
                                </button>

                                <button
                                    onClick={() => handleSocialShare("instagram")}
                                    style={{
                                        background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "50%",
                                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--signal-white)", cursor: "pointer", transition: "all 0.2s ease"
                                    }}
                                    title="Share to Instagram"
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#E1306C"} // Instagram Pink
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
                                >
                                    <FaInstagram size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Share Card (for image generation) */}
            <div style={{ position: "absolute", left: "-9999px", top: "0" }}>
                <ShareCard
                    ref={shareCardRef}
                    originalText={input}
                    translatedText={translation}
                    mode={activeMode}
                    bsScore={bsScore}
                    costOfConfusion={costOfConfusion}
                    moneySaved={moneySaved}
                />
            </div>

        </div>
    );
}
