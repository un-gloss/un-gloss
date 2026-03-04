"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllTerms } from "@/lib/dictionary";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaLock } from "react-icons/fa";

export default function SubmissionForm() {
    const router = useRouter();
    const { addToast } = useToast();
    
    // Form State
    const [evidence, setEvidence] = useState("");
    const [sourceCategory, setSourceCategory] = useState("");
    const [context, setContext] = useState("");
    const [customTranslation, setCustomTranslation] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(true);
    
    // Validation State
    const [containsPII, setContainsPII] = useState(false);
    const [hasJargon, setHasJargon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const SOURCE_OPTIONS = [
        "Tech", "Finance", "Consulting", "HR", "Education", "Government", "Retail", "Big4", "Accounting Firm", "Other"
    ];

    // The Validation Engine Check
    useEffect(() => {
        if (!evidence.trim()) {
            setContainsPII(false);
            setHasJargon(false);
            return;
        }

        // 1. PII Redaction Check (Basic Email Detection)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        setContainsPII(emailRegex.test(evidence));

        // 2. Jargon Density Check
        const terms = getAllTerms();
        const lowerEvidence = evidence.toLowerCase();
        const foundJargon = terms.some(t => lowerEvidence.includes(t.term.toLowerCase()));
        setHasJargon(foundJargon);

    }, [evidence]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final sanity check before submission
        if (containsPII || !hasJargon || !evidence.trim() || !sourceCategory) return;
        
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "submissions"), {
                content: evidence,
                industry_category: sourceCategory,
                context: context || "Not provided",
                user_translation: customTranslation || null,
                isAnonymous: isAnonymous,
                status: 'pending',
                timestamp: serverTimestamp()
            });

            setSubmitSuccess(true);
            
            // Redirect back or to index after a brief success animation
            setTimeout(() => {
                addToast("Evidence successfully filed.", "success");
                router.push("/global-index");
            }, 3000);

        } catch (error) {
            console.error("Failed to submit evidence:", error);
            addToast("Failed to file evidence. Please try again.", "error");
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="glass-panel deblur-effect" style={{ textAlign: "center", padding: "60px 20px", border: "1px solid var(--electric-blue)" }}>
                <FaCheckCircle size={48} color="var(--electric-blue)" style={{ marginBottom: "20px" }} />
                <h2 style={{ fontSize: "1.5rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                    Case Filed
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: "1.6", maxWidth: "400px", margin: "0 auto" }}>
                    Evidence received. Our analysts (the AI) are de-fogging the situation now. Look for it in the Hall of Shame shortly.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
            
            {/* Header */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", fontWeight: "bold", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <FaShieldAlt color="var(--electric-blue)" /> Report Incident
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "8px" }}>
                    Submit evidence of extreme corporate jargon to the Global B.S. Index. All submissions are reviewed for sensitive data before publication.
                </p>
            </div>

            {/* Field 1: The Evidence */}
            <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: "bold" }}>
                    1. Paste the Gloss
                </label>
                <textarea
                    className="glass-input"
                    rows={6}
                    placeholder="Copy the nonsense here..."
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    required
                    style={{ 
                        fontFamily: "'Roboto Mono', monospace",
                        borderColor: containsPII ? "var(--warning-orange)" : "var(--glass-border)",
                        backgroundColor: "rgba(0,0,0,0.3)"
                    }}
                />
                
                {/* Validation Warnings */}
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {containsPII && (
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning-orange)", fontSize: "0.8rem", fontWeight: "bold" }}>
                            <FaExclamationTriangle /> Please redact email addresses or sensitive PII before submitting.
                        </span>
                    )}
                    {evidence.length > 0 && !hasJargon && !containsPII && (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>
                            This sounds too much like a normal person wrote it. Are you sure this is jargon?
                        </span>
                    )}
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                        Instruction: Remove names, specific project titles, or sensitive internal data. We want the jargon, not your secrets.
                    </span>
                </div>
            </div>

            {/* Layout Split for Source and Context */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* Field 2: The Source */}
                <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: "bold" }}>
                        2. Origin of the Fog
                    </label>
                    <select
                        className="glass-input"
                        value={sourceCategory}
                        onChange={(e) => setSourceCategory(e.target.value)}
                        required
                        style={{ cursor: "pointer", backgroundColor: "rgba(0,0,0,0.3)" }}
                    >
                        <option value="" disabled>Select Industry...</option>
                        {SOURCE_OPTIONS.map(opt => (
                            <option key={opt} value={opt} style={{ background: "var(--obsidian)", color: "var(--signal-white)" }}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Field 3: Context */}
                <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: "bold" }}>
                        3. The Crime Scene
                    </label>
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="e.g., An all-hands email, a Slack thread..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    />
                </div>
            </div>

            {/* Field 4: Custom Translation */}
            <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: "bold" }}>
                    4. How do you Un-gloss this? (Optional)
                </label>
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Tell us what they actually meant (if you know)..."
                    value={customTranslation}
                    onChange={(e) => setCustomTranslation(e.target.value)}
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                />
            </div>

            <hr style={{ borderColor: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

            {/* Footer / Submission */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                
                {/* Field 5: Anonymity Toggle */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        style={{ accentColor: "var(--electric-blue)", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "var(--signal-white)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaLock size={12} color="var(--text-muted)" /> Publish as Anonymous
                    </span>
                </label>

                <button
                    type="submit"
                    className="action-button"
                    disabled={isSubmitting || containsPII || !hasJargon || !evidence.trim() || !sourceCategory}
                    style={{
                        opacity: (isSubmitting || containsPII || !hasJargon || !evidence.trim() || !sourceCategory) ? 0.5 : 1,
                        cursor: (isSubmitting || containsPII || !hasJargon || !evidence.trim() || !sourceCategory) ? "not-allowed" : "pointer",
                        minWidth: "200px"
                    }}
                >
                    {isSubmitting ? "FILING EVIDENCE..." : "SUBMIT TO HALL OF SHAME"}
                </button>
            </div>
            
            {/* Overlay if submitting */}
            {isSubmitting && (
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(10, 10, 10, 0.7)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "12px", zIndex: 10,
                    flexDirection: "column", gap: "16px"
                }}>
                    <div className="spinner" style={{ width: "40px", height: "40px", border: "3px solid rgba(0, 123, 255, 0.3)", borderTopColor: "var(--electric-blue)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                    <span style={{ color: "var(--electric-blue)", fontWeight: "bold", letterSpacing: "0.1em" }}>ANALYZING SUBMISSION...</span>
                    
                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}} />
                </div>
            )}
        </form>
    );
}
