import type { Metadata } from "next";
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/700.css';
import '@fontsource/roboto-mono/400.css';
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ToastContainer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import Script from 'next/script';



export const metadata: Metadata = {
  title: "Un-gloss | Radical Clarity in a World of Buzzwords",
  description: "The intellectual tool to strip corporate jargon into human meaning, or professionally pivot blunt truth into C-suite acceptable language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741548022674782"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ToastProvider>
          <div className="container">
            <header className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--glass-border)" }}>
              <Link href="/" className="logo" style={{ textDecoration: "none" }}>
                <span className="logo-mark">U/</span>
                Un<span>gloss</span>
              </Link>
              <nav style={{ display: "flex", gap: "24px", alignItems: "center", fontSize: "0.9rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/global-index" className="nav-link" style={{ color: "var(--warning-orange)" }}>Global Index</Link>
                <Link href="/blog" className="nav-link">Blog</Link>
                <Link href="/preferences" className="nav-link">Preferences</Link>
              </nav>
            </header>
            <AuthProvider>
              {children}
            </AuthProvider>
            <footer style={{ borderTop: "1px solid var(--glass-border)", padding: "40px 24px 100px 24px", marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--signal-white)", fontWeight: "bold" }}>TRENDING DECODES:</span>
                <Link href="/meaning/synergy" className="nav-link">Synergy</Link>
                <Link href="/meaning/bandwidth" className="nav-link">Bandwidth</Link>
                <Link href="/meaning/circle-back" className="nav-link">Circle Back</Link>
                <Link href="/meaning/deep-dive" className="nav-link">Deep Dive</Link>
                <Link href="/meaning/take-this-offline" className="nav-link">Take This Offline</Link>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", justifyContent: "center", gap: "32px", textTransform: "uppercase", letterSpacing: "0.05em", flexWrap: "wrap" }}>
                <Link href="/about" className="nav-link">About Us</Link>
                <Link href="/privacy" className="nav-link">Privacy Policy</Link>
                <Link href="/terms" className="nav-link">Terms of Service</Link>
              </div>
            </footer>
          </div>
          {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
          )}
          <SpeedInsights />
          <Analytics />
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
