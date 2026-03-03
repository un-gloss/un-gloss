"use client";

import TrustPageTemplate, { TrustSection } from "@/components/TrustPageTemplate";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/context/ToastContext";

const aboutSections: TrustSection[] = [
    {
        title: "Our Mission",
        gloss: "Un-gloss is a mission-driven disruptor in the communication-technology vertical, leveraging AI to facilitate cross-functional alignment and optimize enterprise collaboration.",
        ungloss: "We were tired of reading 500-word emails that could have been three bullet points. We built a tool that strips away the polish so you can actually get your work done and go home."
    }
];

function HoverReveal({ jargon, ungloss }: { jargon: string, ungloss: string }) {
    return (
        <span className="group relative inline-block cursor-help font-bold text-black border-b border-dashed border-black hover:border-transparent transition-all" style={{ padding: "0 4px" }}>
            <span style={{ position: "relative", zIndex: 10 }}>{jargon}</span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap font-sans font-black uppercase text-[1rem] tracking-wider z-20"
                style={{ color: "#FF5722" }}
            >
                {ungloss}
            </span>
        </span>
    );
}

export default function AboutPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const { addToast } = useToast();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) return;

        setStatus("submitting");
        try {
            await addDoc(collection(db, "newsletter_subs"), {
                email,
                source: "manifesto",
                timestamp: serverTimestamp()
            });
            setStatus("success");
            setEmail("");
            addToast("Your signature has been recorded. Welcome to the resistance.", "success");
        } catch (error) {
            console.error("Error subscribing:", error);
            setStatus("error");
            addToast("Failed to record signature. Systems are down.", "error");
        }
    };

    return (
        <TrustPageTemplate
            pageTitle="About Us"
            pageDescription="The origin story of the Un-glosser."
            sections={aboutSections}
        >
            {/* The Manifesto Section */}
            <div style={{
                marginTop: "80px",
                padding: "60px 40px",
                background: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                color: "#000000"
            }}>
                <h2 style={{ fontSize: "2.5rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "4px solid #000", paddingBottom: "16px", marginBottom: "40px", fontFamily: "var(--font-sans)" }}>
                    The Surgical Realist Manifesto
                </h2>

                <div style={{ fontSize: "1.4rem", lineHeight: "1.8", fontFamily: "var(--font-serif)", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <p>
                        We believe that the modern workplace is drowning in an ocean of <HoverReveal jargon="Communication Friction" ungloss="POINTLESS WORDS" />. 
                    </p>
                    <p>
                        Professionals are spending millions of hours every year trying to achieve <HoverReveal jargon="Synchronous Alignment" ungloss="AGREEING ON THINGS" /> by writing endless essays to each other that nobody actually wants to read.
                    </p>
                    <p>
                        Our goal is to eliminate the need to <HoverReveal jargon="Circle Back" ungloss="DELAY FOREVER" /> and <HoverReveal jargon="Take Things Offline" ungloss="SHUT PEOPLE UP" />. We demand clarity. We demand brevity. We demand that you just tell us what you want so we can all log out at 5:00 PM.
                    </p>
                    <p style={{ fontWeight: "bold", fontSize: "1.6rem", marginTop: "24px", color: "var(--electric-blue)" }}>
                        Stop managing optics. Start managing reality.
                    </p>
                </div>

                {/* Newsletter Sign Up */}
                <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "2px dashed #CCCCCC" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", color: "#000" }}>
                        Sign the Manifesto (Join the List)
                    </h3>
                    <p style={{ fontSize: "1rem", color: "#666", marginBottom: "24px" }}>
                        Get the 'Jargon of the Week' newsletter. We promise not to spam your inbox or demand your 'bandwidth'.
                    </p>

                    <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "500px" }}>
                        <input 
                            type="email" 
                            placeholder="your.name@company.com" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ flex: 1, padding: "16px", borderRadius: "8px", border: "2px solid #000", fontSize: "1rem", outline: "none", color: "#000", background: "#FFF" }}
                        />
                        <button 
                            type="submit" 
                            disabled={status === "submitting" || status === "success"}
                            style={{ 
                                padding: "0 32px", 
                                background: status === "success" ? "#4CAF50" : "#FF5722", 
                                color: "#FFF", 
                                fontWeight: "bold", 
                                textTransform: "uppercase", 
                                borderRadius: "8px", 
                                border: "none", 
                                cursor: status === "success" ? "default" : "pointer",
                                transition: "background 0.3s ease"
                            }}
                        >
                            {status === "submitting" ? "SIGNING..." : status === "success" ? "SIGNED ✓" : "SIGN"}
                        </button>
                    </form>
                    {status === "error" && <p style={{ color: "red", marginTop: "8px", fontSize: "0.9rem" }}>Oops, failed to submit. Try again.</p>}
                </div>
            </div>
        </TrustPageTemplate>
    );
}
