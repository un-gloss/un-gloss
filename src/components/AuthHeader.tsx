import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";

export default function AuthHeader() {
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return <div style={{ height: "36px" }}></div>; // placeholder
    }

    if (user) {
        return (
            <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--signal-white)",
                        fontSize: "0.85rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                    ) : (
                        <FaUserCircle size={20} />
                    )}
                    <span className="hide-mobile">{user.displayName || user.email}</span>
                </button>

                {dropdownOpen && (
                    <div className="glass-panel" style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "8px",
                        padding: "8px 0",
                        minWidth: "180px",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 100,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}>
                        <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            style={{
                                padding: "12px 16px",
                                color: "var(--signal-white)",
                                textDecoration: "none",
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <FaUser size={14} style={{ color: "var(--electric-blue)" }} /> My Profile
                        </Link>

                        <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }}></div>

                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                logout();
                            }}
                            style={{
                                padding: "12px 16px",
                                color: "var(--warning-orange)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "left",
                                gap: "10px",
                                width: "100%",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <FaSignOutAlt size={14} /> Logout
                        </button>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media (max-width: 600px) {
                        .hide-mobile { display: none !important; }
                    }
                `}} />
            </div>
        );
    }

    return (
        <button
            onClick={signInWithGoogle}
            style={{
                background: "var(--signal-white)",
                color: "var(--obsidian-black)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "transform 0.1s"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            <FaGoogle /> Login
        </button>
    );
}
