"use client";

import ThemeToggle from "@/components/ThemeToggle";

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

                {/* Account Settings (Removed in Phase 12) */}

            </div>
        </div>
    );
}
