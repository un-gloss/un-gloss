import TrustPageTemplate, { TrustSection } from "@/components/TrustPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Un-gloss",
    description: "The rules of engagement for using Un-gloss. Play nice.",
    openGraph: {
        title: "Terms of Service | Un-gloss",
        description: "The Un-glossed terms of service document.",
    },
};

const termsSections: TrustSection[] = [
    {
        title: "User Obligations & Liability",
        gloss: "By accessing this digital interface, the user acknowledges a binding contractual obligation regarding intellectual property rights and liability waivers. The platform assumes no indemnification for strategic misalignments resulting from reliance on the translation matrix.",
        ungloss: "Don't sue us if a 'Professional Pivot' translation doesn't get you a promotion. Don't try to hack our API. Use the tool, be a decent human, and we're all good."
    }
];

export default function TermsPage() {
    return (
        <TrustPageTemplate
            pageTitle="Terms of Service"
            pageDescription="The rules of engagement for our translator."
            sections={termsSections}
        />
    );
}
