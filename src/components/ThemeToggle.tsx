"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    // On mount, check if there's a stored preference
    useEffect(() => {
        const storedTheme = localStorage.getItem("ungloss-theme");
        if (storedTheme === "light") {
            setIsDark(false);
            document.body.classList.add("light-theme");
        }
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const nextIsDark = !prev;
            if (nextIsDark) {
                document.body.classList.remove("light-theme");
                localStorage.setItem("ungloss-theme", "dark");
            } else {
                document.body.classList.add("light-theme");
                localStorage.setItem("ungloss-theme", "light");
            }
            return nextIsDark;
        });
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: "transparent",
                border: "1px solid var(--glass-border)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--signal-white)",
                cursor: "pointer",
                transition: "all 0.3s ease",
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--electric-blue)"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
        >
            {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
    );
}
