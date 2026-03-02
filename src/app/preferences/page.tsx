"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { FaGoogle, FaEnvelope, FaUserCircle } from "react-icons/fa";

export default function PreferencesPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "24px", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "32px", marginTop: "40px" }}>
                
                {/* Page Title */}
                <div>
                     <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--signal-white)", marginBottom: "8px" }}>
                        Preferences
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                        Adjust your interface, manage your account, and set your identity.
                    </p>
                </div>

                {/* Appearance Settings */}
                <div className="glass-panel" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid var(--glass-border)" }}>
                    <div style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--electric-blue)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Appearance</h2>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", color: "var(--signal-white)", margin: 0 }}>Interface Theme</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "4px 0 0 0" }}>Toggle between dark mode (The Shadows) and light mode (The Glare).</p>
                        </div>
                        <div style={{ transform: "scale(1.2)", transformOrigin: "right center" }}>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Account Settings (Mocked for now) */}
                <div className="glass-panel" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid var(--glass-border)" }}>
                     <div style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--electric-blue)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Integration</h2>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <FaUserCircle size={48} color="var(--text-muted)" />
                       <div style={{ flex: 1 }}>
                           <h3 style={{ fontSize: "1rem", color: "var(--signal-white)", margin: 0 }}>Not Logged In</h3>
                           <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>Sign in to save your Hall of Shame translations and claim a permanent alias.</p>
                       </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "8px" }}>
                        <button className="action-button btn-ungloss" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", fontSize: "0.95rem" }} onClick={() => alert("Authentication is temporarily mocked in Phase 2.")}>
                            <FaGoogle size={18} /> Sign In with Google
                        </button>
                        <button className="action-button" style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--signal-white)", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", fontSize: "0.95rem" }} onClick={() => alert("Authentication is temporarily mocked in Phase 2.")}>
                            <FaEnvelope size={18} /> Continue with Email
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
