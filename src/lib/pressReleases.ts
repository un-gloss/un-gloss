export interface PressRelease {
    id: string;
    source: string;
    title: string;
    date: string;
    original: string;
    translated: string;
    category: "Government" | "Corporate Apology" | "Tech Announcement" | "Finance";
}

export const PRESS_RELEASES: PressRelease[] = [
    {
        id: "pr-wef-2026",
        source: "World Economic Forum",
        title: "Global Synergy Initiative",
        date: "January 14, 2026",
        category: "Government",
        original: "We are establishing a multi-stakeholder paradigm to foster cross-border synergy and holistic resilience across macroeconomic vectors, ensuring sustainable bandwidth for future-proofed growth.",
        translated: "We had a meeting about the economy. Nothing was decided."
    },
    {
        id: "pr-hooli-layoffs",
        source: "Hooli Inc.",
        title: "Organizational Restructuring",
        date: "February 28, 2026",
        category: "Corporate Apology",
        original: "In an effort to optimize our operational footprint and realign our core competencies with shifting market dynamics, we have made the difficult decision to reduce our global headcount and transition impacted roles.",
        translated: "We missed our revenue targets, so we're firing people to save the CEO's bonus."
    },
    {
        id: "pr-un-climate",
        source: "United Nations",
        title: "Climate Action Protocol",
        date: "November 05, 2025",
        category: "Government",
        original: "The assembly strongly urges member states to operationalize their declarative commitments and implement harmonized frameworks for the phased mitigation of anthropogenic greenhouse gas emissions.",
        translated: "Please stop polluting. We know you won't, but please try."
    },
    {
        id: "pr-zeta-data",
        source: "ZetaCorp",
        title: "Security Incident Update",
        date: "March 01, 2026",
        category: "Tech Announcement",
        original: "We recently identified an unauthorized exposure of certain non-critical telemetry data. While we have no evidence of malicious exploitation, we are proactively deploying enhanced cryptographic protocols out of an abundance of caution.",
        translated: "We got hacked. Your data is gone. We are pretending it's fine."
    },
    {
        id: "pr-fed-rates",
        source: "Federal Reserve",
        title: "Monetary Policy Statement",
        date: "December 12, 2025",
        category: "Finance",
        original: "The Committee seeks to achieve maximum employment and inflation at the rate of 2 percent over the longer run. In support of these goals, the Committee decided to maintain the target range for the federal funds rate.",
        translated: "We aren't changing interest rates because we don't want to break the stock market before the holidays."
    }
];
