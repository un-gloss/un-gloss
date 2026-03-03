"use client";

import { useToast, ToastType } from "@/context/ToastContext";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success": return <FaCheckCircle size={18} style={{ color: "#4CAF50" }} />;
            case "error": return <FaExclamationCircle size={18} style={{ color: "var(--warning-orange)" }} />;
            case "info": return <FaInfoCircle size={18} style={{ color: "var(--electric-blue)" }} />;
        }
    };

    const getBorderColor = (type: ToastType) => {
        switch (type) {
            case "success": return "#4CAF50";
            case "error": return "var(--warning-orange)";
            case "info": return "var(--electric-blue)";
        }
    };

    return (
        <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            pointerEvents: "none" // Allow clicking through the container invisible space
        }}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    style={{
                        pointerEvents: "auto", // Make the actual toast interactive
                        background: "var(--obsidian)",
                        border: "1px solid var(--glass-border)",
                        borderLeft: `4px solid ${getBorderColor(toast.type)}`,
                        borderRadius: "8px",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        minWidth: "300px",
                        maxWidth: "400px",
                        animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                    }}
                >
                    <div style={{ marginTop: "2px" }}>
                        {getIcon(toast.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <p style={{
                            margin: 0,
                            color: "var(--signal-white)",
                            fontSize: "0.9rem",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 500,
                            lineHeight: 1.4
                        }}>
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "var(--signal-white)"}
                        onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            ))}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}} />
        </div>
    );
}
