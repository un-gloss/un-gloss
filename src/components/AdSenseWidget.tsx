"use client";

import { useEffect } from "react";

export default function AdSenseWidget() {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense Error:", err);
        }
    }, []);

    return (
        <div style={{ padding: "16px 0", width: "100%", overflow: "hidden", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                Advertisement
            </span>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8741548022674782"
                data-ad-slot="un-gloss-auto-slot" // Google will auto-fill this
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}
