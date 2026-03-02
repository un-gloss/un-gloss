import TranslationDeck from "@/components/TranslationDeck";
import CommunityFeed from "@/components/CommunityFeed";
import StatsBar from "@/components/StatsBar";
import HistorySidebar from "@/components/HistorySidebar";
import TrendingWidget from "@/components/TrendingWidget";
import AmbientBackground from "@/components/AmbientBackground";

export default function Home() {
  return (
    <main>
      <AmbientBackground />

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(250px, 0.6fr) minmax(400px, 1.4fr) minmax(300px, 1fr)",
        gap: "30px",
        alignItems: "start",
        width: "95%",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px 20px 60px 20px",
        position: "relative",
        zIndex: 1
      }} className="desktop-pro-grid">

        <div style={{ gridColumn: "1 / -1", textAlign: "center", marginBottom: "40px" }}>
          <h1 className="hero-title">
            The truth, <span style={{ color: "var(--warning-orange)", opacity: 0.8 }}>unpolished.</span>
          </h1>
          <p className="hero-subtitle">
            Strip away the corporate fog to reveal human meaning, or professionally pivot blunt truth into C-suite acceptable language.
          </p>
        </div>

        <div style={{ gridColumn: "1 / -1", marginBottom: "10px" }}>
          <StatsBar />
        </div>

        <div style={{ position: "sticky", top: "40px", display: "flex", flexDirection: "column", gap: "30px" }} className="hide-tablet">
          <HistorySidebar />
          <TrendingWidget />
        </div>

        <div>
          <TranslationDeck />
        </div>

        <div style={{ position: "sticky", top: "40px" }}>
          <CommunityFeed />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 1100px) {
            .desktop-pro-grid {
                grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) !important;
            }
            .hide-tablet {
                display: none !important;
            }
        }
        @media (max-width: 800px) {
            .desktop-pro-grid {
                grid-template-columns: 1fr !important;
            }
        }
      `}} />
    </main>
  );
}
