import SubmissionForm from "@/components/SubmissionForm";
import Head from "next/head";

export const metadata = {
    title: "Report to the Hall of Shame | Un-gloss",
    description: "Submit your worst examples of corporate jargon to the Global B.S. Index. All submissions are automatically scrubbed for PII.",
};

export default function SubmitPage() {
    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Head>

            <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px 100px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--signal-white)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
                        File Evidence
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
                        Protect your sanity. Submit the most egregious corporate buzzwords, mission statements, or passive-aggressive emails to the Global B.S. Index.
                    </p>
                </div>

                <SubmissionForm />
            </main>
        </>
    );
}
