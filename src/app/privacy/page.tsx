import TrustPageTemplate, { TrustSection } from "@/components/TrustPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Un-gloss",
    description: "Our radically honest privacy policy. We see your jargon so we can fix it, but we don't sell your secrets.",
    openGraph: {
        title: "Privacy Policy | Un-gloss",
        description: "Read the un-glossed truth about how we handle your data.",
    },
};

const privacySections: TrustSection[] = [
    {
        title: "Data Collection & Usage",
        gloss: "We utilize advanced data-optimization protocols to ensure synergistic user experiences. Information provided through our digital interface is processed to facilitate cross-functional alignment and optimize service delivery vectors.",
        ungloss: "We see your jargon so we can fix it. We don't sell your secrets to your boss or HR. We use cookies to remember your settings, not to stalk you."
    }
];

export default function PrivacyPage() {
    return (
        <TrustPageTemplate
            pageTitle="Privacy Policy"
            pageDescription="The legal requirements, stripped of the B.S."
            sections={privacySections}
        />
    );
}
