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
        id: "pr-bp-spill",
        source: "BP",
        title: "Deepwater Horizon Response",
        date: "May 2010",
        category: "Corporate Apology",
        original: "We have been dealing with a massive flow of hydrocarbons... I would like my life back.",
        translated: "We destroyed the Gulf of Mexico, but frankly, I'm the real victim here because I have to work weekends."
    },
    {
        id: "pr-meta-privacy",
        source: "Meta (Facebook)",
        title: "Platform Privacy Update",
        date: "March 2018",
        category: "Tech Announcement",
        original: "We have a responsibility to protect your data, and if we can't then we don't deserve to serve you... We will learn from this experience to secure our platform further and make our community safer for everyone going forward.",
        translated: "We sold your data to a political consulting firm. We're sorry we got caught."
    },
    {
        id: "pr-united-airlines",
        source: "United Airlines",
        title: "Flight 3411 Incident",
        date: "April 2017",
        category: "Corporate Apology",
        original: "This is an upsetting event to all of us here at United. I apologize for having to re-accommodate these customers.",
        translated: "We physically dragged a paying customer off a plane because we overbooked it."
    },
    {
        id: "pr-enron",
        source: "Enron",
        title: "Annual Report Letter",
        date: "Early 2001",
        category: "Finance",
        original: "Our performance and business capabilities have never been stronger... We have transformed ourselves from a pipeline company to an Internet-based communications and energy trading company.",
        translated: "We are currently committing the largest accounting fraud in corporate history."
    },
    {
        id: "pr-peloton",
        source: "Peloton",
        title: "Tread+ Recall",
        date: "May 2021",
        category: "Corporate Apology",
        original: "I want to be clear, Peloton made a mistake in our initial response to the Consumer Product Safety Commission’s request that we recall the Tread+. We should have engaged more productively with them from the outset.",
        translated: "Our treadmills injured children, but we fought the recall for a month to protect our stock price."
    }
];
