import type { Metadata } from "next";
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/700.css';
import '@fontsource/roboto-mono/400.css';
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AuthProvider } from "@/context/AuthContext";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';



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
      <body>
        <div className="container">
          <header className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="/" className="logo">
              <span className="logo-mark">U/</span>
              Un<span>gloss</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <ThemeToggle />
            </div>
          </header>
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
        )}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
