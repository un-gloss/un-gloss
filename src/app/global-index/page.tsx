"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { FeedFilter } from "@/components/CommunityFeed";
import StatsBar from "@/components/StatsBar";

// Lazy load heavy components
const CommunityFeed = dynamic(() => import('@/components/CommunityFeed'), {
    loading: () => <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading Hall of Shame...</div>
});

const TrendingWidget = dynamic(() => import('@/components/TrendingWidget'), {
    loading: () => <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>Loading trends...</div>
});

export default function GlobalIndexPage() {
    // State to hold the current filter. null means "show all"
    const [activeFilter, setActiveFilter] = useState<{
        type: 'source' | 'region';
        name: string;
        filter: FeedFilter;
    } | null>(null);

    // This callback is passed to the TrendingWidget to handle clicks on the leaderboard
    const handleTrendClick = (type: 'source' | 'region', name: string) => {
        if (activeFilter?.name === name) {
            // Toggle off if clicking the same item again
            setActiveFilter(null);
        } else {
            setActiveFilter({
                type,
                name,
                filter: {
                    field: type === 'source' ? 'source' : 'country',
                    operator: '==',
                    value: name
                }
            });
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "40px 20px" }}>
            
            {/* Page Header */}
            <div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Global B.S. Index
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "800px" }}>
                    A live, aggregated view of the worst corporate jargon circulating the globe. Click on any top offending source or region to filter the Hall of Shame.
                </p>
            </div>

            {/* Top Level Summary Stats */}
            <StatsBar />

            {/* Split Pane Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px", alignItems: "start" }} className="global-index-grid">
                
                {/* Left Pane: The Leaderboards */}
                <div style={{ position: "sticky", top: "40px" }}>
                    {/* We pass the onTrendClick prop so the widget can communicate back to this parent and change the filter state */}
                    <TrendingWidget 
                        onTrendClick={handleTrendClick} 
                        activeSelection={activeFilter?.name} 
                    />
                </div>

                {/* Right Pane: The Filtered Feed */}
                <div style={{ minHeight: "800px" }}>
                    {activeFilter && (
                        <div style={{ 
                            marginBottom: "20px", 
                            padding: "16px", 
                            background: "rgba(255, 87, 34, 0.05)", 
                            borderLeft: "4px solid var(--warning-orange)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.1em" }}>
                                    Active Filter
                                </span>
                                <div style={{ fontSize: "1.2rem", color: "var(--signal-white)", fontWeight: "bold" }}>
                                    Showing offenses from: <span style={{ color: "var(--warning-orange)" }}>{activeFilter.name}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveFilter(null)}
                                className="action-button btn-secondary"
                                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                            >
                                CLEAR FILTER
                            </button>
                        </div>
                    )}
                    
                    <CommunityFeed 
                        filter={activeFilter?.filter} 
                        titleOverride={activeFilter ? `Offenses: ${activeFilter.name}` : "Global Hall of Shame"}
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 900px) {
                    .global-index-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    );
}
