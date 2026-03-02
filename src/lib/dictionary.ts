// src/lib/dictionary.ts

export interface JargonTerm {
    term: string;
    slug: string;
    corporateDefinition: string;
    theTruth: string;
    passiveAggressiveRating: number;
    usageJargon: string;
    usageUnGlossed: string;
    seoMetaDescription: string;
    keywords: string[];
    relatedTerms: string[];
}

export const dictionary: JargonTerm[] = [
    {
        term: "Circle Back",
        slug: "circle-back",
        corporateDefinition: "A commitment to revisit an unresolved topic or action item at an unspecified future date.",
        theTruth: "I don't have the answer right now, and I'm hoping you forget about it by tomorrow.",
        passiveAggressiveRating: 7,
        usageJargon: "Let's circle back on this next week when we have more bandwidth.",
        usageUnGlossed: "Let's stop talking about this because I'm not going to do it right now.",
        seoMetaDescription: "What does 'Circle Back' actually mean? Hint: It’s not about a circle. Discover the un-glossed truth behind this classic corporate deflection.",
        keywords: ["circle back meaning", "corporate lingo", "what does circle back mean", "office jargon", "delay tactic"],
        relatedTerms: ["bandwidth", "offline"]
    },
    {
        term: "Bandwidth",
        slug: "bandwidth",
        corporateDefinition: "The energy or mental capacity required to deal with a situation. Often used as a polite refusal to take on additional work.",
        theTruth: "I am too busy, too stressed, or simply do not care enough to help you with this.",
        passiveAggressiveRating: 8,
        usageJargon: "I simply don't have the bandwidth to take on another project this quarter.",
        usageUnGlossed: "I'm already working 50 hours a week and if you give me one more task I will quit.",
        seoMetaDescription: "Decode the term 'Bandwidth'. It's not about your internet connection—it's about survival. Learn how to translate this polite corporate refusal.",
        keywords: ["bandwidth meaning text", "corporate bandwidth", "not enough bandwidth", "office slang", "polite refusal work"],
        relatedTerms: ["circle-back", "hard-stop"]
    },
    {
        term: "Synergy",
        slug: "synergy",
        corporateDefinition: "The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects. Usually involves a merger and subsequent layoffs.",
        theTruth: "We bought a company, fired half their people, and hope the remaining ones work twice as hard.",
        passiveAggressiveRating: 9,
        usageJargon: "We're looking to leverage the synergy between our two departments to drive Q3 growth.",
        usageUnGlossed: "We're combining our departments so we can lay off redundant management.",
        seoMetaDescription: "What does 'Synergy' really mean in the corporate world? Strip away the buzzwords and uncover the brutal reality of organizational alignment.",
        keywords: ["synergy meaning business", "corporate buzzwords", "synergize", "business jargon", "meaning of synergy"],
        relatedTerms: ["alignment", "bandwidth"]
    },
    {
        term: "Alignment",
        slug: "alignment",
        corporateDefinition: "Ensuring all stakeholders share the same vision, goals, and understanding of a project's trajectory.",
        theTruth: "Getting everyone to agree to do what I already decided we were going to do.",
        passiveAggressiveRating: 6,
        usageJargon: "Before we proceed, we need to ensure cross-functional alignment across the leadership team.",
        usageUnGlossed: "I refuse to move forward until the executives explicitly say yes so I don't get blamed if this fails.",
        seoMetaDescription: "What is corporate 'Alignment'? It sounds harmonious, but it's really about covering your tracks. Un-gloss this ubiquitous piece of office jargon.",
        keywords: ["corporate alignment", "cross-functional alignment", "office jargon", "team alignment", "business dictionary"],
        relatedTerms: ["synergy", "offline"]
    },
    {
        term: "Hard Stop",
        slug: "hard-stop",
        corporateDefinition: "A definitive time at which a meeting or engagement must conclude, owing to an immovable subsequent commitment.",
        theTruth: "I am desperately looking for an excuse to leave this meeting.",
        passiveAggressiveRating: 8,
        usageJargon: "I have a hard stop at 2:00 PM, so let's keep this high-level.",
        usageUnGlossed: "I will literally walk out of this room at 1:59 because I hate these meetings.",
        seoMetaDescription: "What does it mean to have a 'Hard Stop'? Decode the ultimate corporate exit strategy and learn how to use this phrase to escape useless meetings.",
        keywords: ["hard stop meaning", "meeting hard stop", "corporate phrases", "office survival", "professional synonyms"],
        relatedTerms: ["circle-back", "bandwidth"]
    }
];

export function getTermBySlug(slug: string): JargonTerm | undefined {
    return dictionary.find(t => t.slug === slug.toLowerCase());
}

export function getAllTerms(): JargonTerm[] {
    return dictionary;
}
