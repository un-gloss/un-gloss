"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaLinkedinIn, FaRedditAlien, FaFacebookF, FaInstagram, FaDownload } from "react-icons/fa";
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
    const shareCardRef = useRef<HTMLDivElement>(null);

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

            {/* The Fog (Input Pane) */}
            <div className="glass-panel" style={{ position: "relative" }}>

                {/* Feature: B.S. Meter */}
                {translation && bsScore !== null && (
                    <div style={{
                        position: "absolute",
                        top: "-20px",
                        right: "20px",
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
                </div>

                <textarea
                    className="glass-input"
                    rows={5}
                    placeholder="Paste the corporate jargon (or raw human truth) here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>// The Source</span>
                    </div>
                    <input
                        className="glass-input"
                        type="text"
                        style={{ padding: "10px 16px" }}
                        placeholder='Who is the source of this fog? (e.g., "My Boss," "McKinsey," "Google," etc.)'
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <div style={{ marginTop: "6px", fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Identify the source to help track the Global B.S. Index.
                    </div>
                </div>
            </div>

            {/* The Pivot (Action Bar) */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", padding: "10px 0" }}>
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

            {/* Feature: Passive-Aggressive Slider (Only for Pivot) */}
            {activeMode === "pivot" && (
                <div style={{ padding: "0 20px" }}>
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

            {/* The Clarity (Output Pane) */}
            <div
                className="glass-panel"
                style={{
                    background: "var(--obsidian)",
                    border: translation ? `1px solid ${activeMode === 'ungloss' ? 'var(--warning-orange)' : 'var(--electric-blue)'}` : "1px solid var(--glass-border)",
                    opacity: translation ? 1 : 0.4,
                    filter: translation ? "none" : "blur(4px)",
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
                            letterSpacing: "0.1em"
                        }}>
              // {activeMode === 'ungloss' ? 'The Truth' : 'The Polish'}
                        </span>
                    </div>

                    <p className={activeMode === 'ungloss' ? "human-text" : "corporate-text"} style={{ whiteSpace: "pre-wrap" }}>
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
