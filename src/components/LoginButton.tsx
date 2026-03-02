"use client";

import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaUserCircle, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function LoginButton() {
    const { user, signInWithEmail, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    
    // Login form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            setLoginOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div style={{ position: "relative" }}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "8px 16px", borderRadius: "20px",
                        color: "var(--signal-white)", cursor: "pointer",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                    <img 
                        src={user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"} 
                        alt="Avatar" 
                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                    />
                    <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || "User"}
                    </span>
                </button>

                {dropdownOpen && (
                    <div style={{
                        position: "absolute", top: "calc(100% + 10px)", right: 0,
                        background: "rgba(26,26,26,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", padding: "10px",
                        minWidth: "150px", backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        display: "flex", flexDirection: "column", gap: "5px",
                        zIndex: 100
                    }}>
                        <Link href="/profile" 
                            onClick={() => setDropdownOpen(false)}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "10px", color: "var(--signal-white)",
                                textDecoration: "none", borderRadius: "4px",
                                fontSize: "0.9rem", transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <FaUserCircle /> Profile
                        </Link>
                        <button 
                            onClick={() => { logout(); setDropdownOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "10px", color: "var(--warning-orange)",
                                background: "none", border: "none", cursor: "pointer",
                                borderRadius: "4px", fontSize: "0.9rem", textAlign: "left",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setLoginOpen(!loginOpen)}
                style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "var(--electric-blue)", color: "#fff",
                    border: "none", padding: "8px 20px",
                    borderRadius: "20px", fontSize: "0.9rem",
                    fontWeight: "bold", cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 123, 255, 0.4)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 123, 255, 0.3)";
                }}
            >
                <FaEnvelope /> Sign In
            </button>

            {loginOpen && (
                <div style={{
                    position: "absolute", top: "calc(100% + 15px)", right: 0,
                    background: "rgba(26,26,26,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", padding: "20px",
                    minWidth: "250px", backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                    zIndex: 100
                }}>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Login</h3>
                        
                        {error && <div style={{ color: "var(--warning-orange)", fontSize: "0.8rem", background: "rgba(255,87,34,0.1)", padding: "8px", borderRadius: "4px" }}>{error}</div>}
                        
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%", padding: "10px",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--signal-white)", borderRadius: "6px",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%", padding: "10px",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--signal-white)", borderRadius: "6px",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%", padding: "10px",
                                background: loading ? "gray" : "var(--electric-blue)",
                                color: "#fff", border: "none",
                                borderRadius: "6px", fontWeight: "bold",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
