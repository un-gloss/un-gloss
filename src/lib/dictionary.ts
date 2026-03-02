// src/lib/dictionary.ts

export interface JargonTerm {
    term: string;
    slug: string;
    corporateDefinition: string;
    theTruth: string;
    passiveAggressiveRating?: number;
    sincerityRating?: number;
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
    },
    {
        term: "Take this offline",
        slug: "take-this-offline",
        corporateDefinition: "A strategic pivot to discuss a matter privately, ensuring the broader meeting remains focused on high-level objectives rather than granular details.",
        theTruth: "Please stop talking so my meeting can end on time.",
        sincerityRating: 3,
        usageJargon: "That's a great point, Todd, but let's take this offline so we can keep the agenda moving.",
        usageUnGlossed: "Todd, nobody cares about your spreadsheet and I want to go to lunch.",
        seoMetaDescription: "What does 'take it offline' really mean in a meeting? Learn the truth behind this common corporate deflection and how to survive the modern office.",
        keywords: ["take this offline meaning", "meeting deflection", "office jargon", "take it offline alternative", "sync up meaning"],
        relatedTerms: ["circle-back", "hard-stop"]
    },
    {
        term: "Growth Mindset",
        slug: "growth-mindset",
        corporateDefinition: "An organizational philosophy emphasizing continuous learning, resilience, and the belief that abilities can be developed through dedication and hard work.",
        theTruth: "A psychological trick to make you feel bad about complaining when we give you more work without more pay.",
        sincerityRating: 2,
        usageJargon: "We need everyone to approach this Q4 restructuring with a true growth mindset.",
        usageUnGlossed: "Three people quit, you have to do their jobs now, and you aren't allowed to be mad about it.",
        seoMetaDescription: "What is a 'growth mindset' in business? Decode this HR buzzword and discover the un-glossed reality of workplace resilience training.",
        keywords: ["growth mindset corporate", "HR buzzwords", "growth mindset meaning", "toxic positivity at work", "corporate philosophy"],
        relatedTerms: ["synergy", "alignment"]
    },
    {
        term: "Low-hanging fruit",
        slug: "low-hanging-fruit",
        corporateDefinition: "Easily achievable goals or tasks that can be rapidly completed to demonstrate immediate value and build early momentum for a project.",
        theTruth: "The incredibly obvious, simple stuff we should have done months ago but somehow didn't.",
        sincerityRating: 5,
        usageJargon: "Let's tackle the low-hanging fruit first to get some quick wins on the board for the stakeholders.",
        usageUnGlossed: "Let's do the easiest possible thing so the executives don't fire us.",
        seoMetaDescription: "What does 'low-hanging fruit' mean in business? Strip away the jargon and find out what your manager actually wants you to do.",
        keywords: ["low hanging fruit meaning", "quick wins", "business metaphors", "easy tasks jargon", "office slang"],
        relatedTerms: ["bandwidth", "alignment"]
    },
    {
        term: "Touch base",
        slug: "touch-base",
        corporateDefinition: "A brief, informal alignment session to ensure ongoing synchronization and provide status updates on active deliverables.",
        theTruth: "A completely unnecessary 15-minute interruption to ask you if you've done the thing yet.",
        sincerityRating: 4,
        usageJargon: "I just wanted to touch base regarding the deliverables for the Henderson account.",
        usageUnGlossed: "Are you done yet?",
        seoMetaDescription: "What does it mean to 'touch base'? Learn the real definition of this classic office phrase and how to survive micro-management.",
        keywords: ["touch base meaning", "sync up alternative", "micromanagement jargon", "office check-in", "corporate phrases"],
        relatedTerms: ["alignment", "circle-back"]
    },
    {
        term: "Holistic approach",
        slug: "holistic-approach",
        corporateDefinition: "A comprehensive strategy that considers the interconnectedness of all system components rather than addressing isolated elements independently.",
        theTruth: "We have no specific plan so we're just going to broadly look at everything until a solution magically appears.",
        sincerityRating: 2,
        usageJargon: "We need to take a more holistic approach to our user acquisition funnel if we want to move the needle.",
        usageUnGlossed: "Nobody knows why sales are down, so let's just brainstorm for an hour.",
        seoMetaDescription: "What is a 'holistic approach' in the corporate world? Un-gloss this abstract buzzword and learn what executives are really trying to say.",
        keywords: ["holistic approach business", "holistic strategy meaning", "executive buzzwords", "corporate fluff", "big picture jargon"],
        relatedTerms: ["synergy", "alignment"]
    }
];

export function getTermBySlug(slug: string): JargonTerm | undefined {
    return dictionary.find(t => t.slug === slug.toLowerCase());
}

export function getAllTerms(): JargonTerm[] {
    return dictionary;
}
