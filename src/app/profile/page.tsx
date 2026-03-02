"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { FaUser, FaCalendar, FaGlobe, FaArrowLeft, FaCamera, FaCrown } from 'react-icons/fa';
import AmbientBackground from '@/components/AmbientBackground';

// Pre-defined premium avatars (placeholders)
const PREMIUM_AVATARS = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Jude",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Nala"
];

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Japan", "Singapore", "Brazil", "Other"];

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirection disabled for demo, but hooks kept for context
    useEffect(() => {
        // if (!loading && !user) {
        //     router.push('/');
        // }
    }, [user, loading, router]);

    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [country, setCountry] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isPremium, setIsPremium] = useState(false);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Protect route and load profile data
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user, loading, router]);

    const loadUserProfile = async () => {
        // [MOCKED FOR UI DEV]
        setDisplayName("Demo User");
        setUsername("demouser");
        setDob("1995-05-15");
        setCountry("United States");
        setAvatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=Jude");
        setIsPremium(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        setSaving(true);

        // [MOCKED FOR UI DEV] 
        setTimeout(() => {
            setMessage("Profile updated successfully! (Demo Mode)");
            setSaving(false);
            setTimeout(() => setMessage(""), 3000);
        }, 800);
    };

    // Loading check disabled for standalone UI demo
    // if (loading || !user) {
    //     return (
    //         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    return (
        <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
            <AmbientBackground />

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

                <div style={{ marginBottom: "40px", display: "flex", alignItems: "center" }}>
                    <Link href="/" style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        transition: "color 0.2s"
                    }}
                        onMouseOver={(e) => e.currentTarget.style.color = "var(--signal-white)"}
                        onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
                        <div>
                            <h1 style={{ fontSize: "2rem", color: "var(--signal-white)", margin: "0 0 10px 0" }}>Profile Settings</h1>
                            <p style={{ color: "var(--text-muted)", margin: 0 }}>Manage your personal identity and preferences.</p>
                        </div>
                        {isPremium && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "var(--warning-orange)", color: "#1A1A1A", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                <FaCrown /> Premium Member
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Avatar Section */}
                        <div>
                            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                                Avatar <FaCamera style={{ marginLeft: "6px" }} />
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                <img
                                    src={avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"}
                                    alt="Profile Avatar"
                                    style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }}
                                />
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {PREMIUM_AVATARS.map((url, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setAvatarUrl(url)}
                                            style={{
                                                width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer",
                                                border: avatarUrl === url ? "2px solid var(--electric-blue)" : "2px solid transparent",
                                                opacity: avatarUrl === url ? 1 : 0.6,
                                                transition: "all 0.2s"
                                            }}
                                        >
<img src={url} alt={`Avatar ${idx}`} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                                        </div>
                                    ))}
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: "100%", marginTop: "4px" }}>
                                        {!isPremium ? "First change is free. Become Premium for unlimited avatar styling." : "Select your Premium avatar."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name & Username */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your Name"
                                    style={{
                                        width: "100%", padding: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                                        color: "var(--signal-white)", borderRadius: "4px", fontSize: "1rem"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                                    <FaUser /> Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="@username"
                                    style={{
                                        width: "100%", padding: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                                        color: "var(--signal-white)", borderRadius: "4px", fontSize: "1rem", fontFamily: "var(--font-mono)"
                                    }}
                                />
                            </div>
                        </div>

                        {/* DOB & Country */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                                    <FaCalendar /> Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    style={{
                                        width: "100%", padding: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                                        color: "var(--signal-white)", borderRadius: "4px", fontSize: "1rem", fontFamily: "var(--font-mono)", colorScheme: "dark"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                                    <FaGlobe /> Country
                                </label>
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    style={{
                                        width: "100%", padding: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                                        color: "var(--signal-white)", borderRadius: "4px", fontSize: "1rem"
                                    }}
                                >
                                    <option value="" disabled>Select your location</option>
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    background: "var(--electric-blue)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 30px",
                                    borderRadius: "4px",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.7 : 1,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    transition: "background 0.2s"
                                }}
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>

                            {message && (
                                <span style={{ color: message.includes("success") ? "var(--electric-blue)" : "var(--warning-orange)", fontSize: "0.9rem" }}>
                                    {message}
                                </span>
                            )}
                        </div>
                    </form>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 600px) {
                    form > div[style*="grid"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </main>
    );
}
