// src/lib/dictionary.ts

export interface JargonTerm {
    term: string;
    slug: string;
    corporateDefinition: string;
    theTruth: string;
    relatedTerms: string[];
}

export const dictionary: JargonTerm[] = [
    {
        term: "Synergy",
        slug: "synergy",
        corporateDefinition: "The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects. Usually involves a merger and subsequent layoffs.",
        theTruth: "We bought a company, fired half their people, and hope the remaining ones work twice as hard.",
        relatedTerms: ["bandwidth", "alignment"]
    },
    {
        term: "Bandwidth",
        slug: "bandwidth",
        corporateDefinition: "The energy or mental capacity required to deal with a situation. Often used as a polite refusal to do work.",
        theTruth: "I am too busy, too stressed, or simply do not care enough to help you with this.",
        relatedTerms: ["circle-back", "synergy"]
    },
    {
        term: "Circle Back",
        slug: "circle-back",
        corporateDefinition: "A commitment to revisit an unresolved topic or action item at an unspecified future date.",
        theTruth: "I don't have the answer right now, and I'm hoping you forget about it by tomorrow.",
        relatedTerms: ["offline", "bandwidth"]
    },
    {
        term: "Take it Offline",
        slug: "offline",
        corporateDefinition: "To discuss a matter privately outside of a larger meeting to respect everyone's time.",
        theTruth: "Your question is derailing my meeting, please stop talking so we can move on.",
        relatedTerms: ["circle-back", "alignment"]
    },
    {
        term: "Alignment",
        slug: "alignment",
        corporateDefinition: "Ensuring all stakeholders share the same vision, goals, and understanding of a project's trajectory.",
        theTruth: "Getting everyone to agree to do what I already decided we were going to do.",
        relatedTerms: ["synergy", "offline"]
    }
];

export function getTermBySlug(slug: string): JargonTerm | undefined {
    return dictionary.find(t => t.slug === slug.toLowerCase());
}

export function getAllTerms(): JargonTerm[] {
    return dictionary;
}
