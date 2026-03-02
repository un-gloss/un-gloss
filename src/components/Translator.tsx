"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Translator() {
    const [input, setInput] = useState("");
    const [source, setSource] = useState("");
    const [translation, setTranslation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setTranslation("");

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input, source: source }),
            });

            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            setTranslation(data.translation);

            // Save to Firebase (fails silently if not configured yet)
            try {
                await addDoc(collection(db, "translations"), {
                    originalText: input,
                    source: source || "Anonymous",
                    translation: data.translation,
                    timestamp: serverTimestamp()
                });
            } catch (fbError) {
                console.warn("Firebase not configured or failed to save:", fbError);
            }

        } catch (error) {
            console.error(error);
            setTranslation("ERROR: FAILED TO SYNERGIZE.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        const shareText = `"${input}"\n\nTranslation: ${translation}\n\nTranslated by @ExecSubtitle`;

        // Copy for Instagram/General
        navigator.clipboard.writeText(shareText);
        alert("Translation copied to clipboard! You can paste this on Instagram.");

        // LinkedIn Intent
        const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
        window.open(linkedinUrl, "_blank");
    };

    return (
        <div className="card">
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    CORPORATE JARGON
                </label>
                <textarea
                    rows={4}
                    placeholder="e.g., We need to circle back and synergize our low-hanging fruit to move the needle."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>
                    SOURCE (OPTIONAL)
                </label>
                <input
                    type="text"
                    placeholder="e.g., My Boss, Open Source News Feed"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
            </div>

            <button
                onClick={handleTranslate}
                disabled={isLoading || !input.trim()}
                style={{ width: "100%", marginBottom: "20px" }}
            >
                {isLoading ? "TRANSLATING..." : "TRANSLATE TO HUMAN"}
            </button>

            {translation && (
                <div style={{ marginTop: "30px", borderTop: "4px solid var(--border-color)", paddingTop: "20px" }}>
                    <h3 style={{ marginBottom: "16px", color: "var(--primary-accent)" }}>BLUNT REALITY:</h3>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", fontFamily: "'Impact', sans-serif", lineHeight: "1.2" }}>
                        {translation}
                    </p>

                    <button
                        onClick={handleShare}
                        style={{
                            marginTop: "20px",
                            backgroundColor: "var(--bg-color)",
                            color: "var(--text-color)",
                            fontSize: "1rem"
                        }}
                    >
                        SHARE & TAG @EXECSUBTITLE
                    </button>
                </div>
            )}
        </div>
    );
}
