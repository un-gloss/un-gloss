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
    },
    {
        term: "Ping",
        slug: "ping",
        corporateDefinition: "To send a brief electronic message to initiate contact, check status, or prompt a response.",
        theTruth: "I am going to bother you on Slack until you acknowledge my existence.",
        passiveAggressiveRating: 6,
        sincerityRating: 8,
        usageJargon: "I'll ping you on Slack when the client joins the waiting room.",
        usageUnGlossed: "Watch your messages because I expect an immediate reply.",
        seoMetaDescription: "What does it mean to 'ping' someone at work? Translate this common tech and office jargon into plain English.",
        keywords: ["ping meaning", "ping someone", "office tech jargon", "slack terminology", "what does ping mean"],
        relatedTerms: ["touch-base", "bandwidth"]
    },
    {
        term: "Deep Dive",
        slug: "deep-dive",
        corporateDefinition: "An exhaustive, comprehensive analysis of a specific subject, issue, or metric to uncover root causes and nuanced insights.",
        theTruth: "A grueling, multi-hour meeting where we stare at spreadsheets until someone figures out whose fault the terrible numbers are.",
        passiveAggressiveRating: 7,
        sincerityRating: 4,
        usageJargon: "We need to do a deep dive into the Q2 churn metrics on Friday.",
        usageUnGlossed: "Clear your Friday afternoon. We are going to aggressively investigate why we lost so many customers.",
        seoMetaDescription: "Decode the corporate phrase 'deep dive'. Learn what managers really mean when they schedule an exhaustive analytical meeting.",
        keywords: ["deep dive meaning", "corporate deep dive", "analysis jargon", "office slang", "business meeting terms"],
        relatedTerms: ["holistic-approach", "alignment"]
    },
    {
        term: "Boil the Ocean",
        slug: "boil-the-ocean",
        corporateDefinition: "To undertake an impossibly large or overly ambitious task, usually by expanding the scope of a project beyond reasonable limits.",
        theTruth: "You are making this way too complicated and we don't have the budget or time for your grand vision.",
        passiveAggressiveRating: 8,
        sincerityRating: 7,
        usageJargon: "Let's focus on the MVP for now. We don't need to boil the ocean on version one.",
        usageUnGlossed: "Stop adding features, just ship the basic version before we run out of money.",
        seoMetaDescription: "What does the idiom 'boil the ocean' mean in business? Strip away the metaphor and understand this classic project management warning.",
        keywords: ["boil the ocean meaning", "business idioms", "scope creep jargon", "corporate warnings", "project management terms"],
        relatedTerms: ["low-hanging-fruit", "bandwidth"]
    },
    {
        term: "Move the Needle",
        slug: "move-the-needle",
        corporateDefinition: "To generate a noticeable, measurable, and significant impact on key performance indicators or bottom-line results.",
        theTruth: "To actually do something that makes us money, rather than just talking about doing things.",
        passiveAggressiveRating: 6,
        sincerityRating: 6,
        usageJargon: "This marketing campaign is nice, but is it really going to move the needle on our Q4 revenue?",
        usageUnGlossed: "This campaign is cute, but it won't generate actual sales.",
        seoMetaDescription: "What does 'move the needle' mean in the corporate world? Un-gloss this sales and marketing jargon to find the blunt truth.",
        keywords: ["move the needle meaning", "business impact jargon", "sales terminology", "corporate cliches", "KPI jargon"],
        relatedTerms: ["low-hanging-fruit", "synergy"]
    },
    {
        term: "Open the Kimono",
        slug: "open-the-kimono",
        corporateDefinition: "To reveal inner workings, financial records, or proprietary secrets to an external partner, often during negotiations or audits.",
        theTruth: "An incredibly outdated, highly inappropriate phrase used by older executives to mean 'showing our private data'.",
        passiveAggressiveRating: 2,
        sincerityRating: 8,
        usageJargon: "Before we sign the acquisition papers, they need us to open the kimono on our user retention data.",
        usageUnGlossed: "We have to show them our highly confidential, embarrassing internal metrics.",
        seoMetaDescription: "What does the inappropriate business phrase 'open the kimono' mean? Learn the history and translation of this outdated corporate idiom.",
        keywords: ["open the kimono meaning", "inappropriate business jargon", "corporate idioms", "financial transparency slang", "outdated office slang"],
        relatedTerms: ["synergy", "alignment"]
    },
    {
        term: "Thought Leader",
        slug: "thought-leader",
        corporateDefinition: "An individual or firm recognized as a foremost authority in a specialized field, driving innovation and industry-wide perspective shifts.",
        theTruth: "Someone who posts excessively on LinkedIn using lots of line breaks, but hasn't done any actual work in five years.",
        passiveAggressiveRating: 5,
        sincerityRating: 2,
        usageJargon: "We are positioning our CEO as a thought leader in the B2B SaaS ecosystem.",
        usageUnGlossed: "We are paying a PR firm to write articles with our CEO's name on them so we look important.",
        seoMetaDescription: "What is a 'thought leader'? Strip away the ego and decode this common LinkedIn and PR buzzword.",
        keywords: ["thought leader meaning", "linkedin jargon", "corporate influencer", "PR buzzwords", "business authority meaning"],
        relatedTerms: ["synergy", "holistic-approach"]
    },
    {
        term: "Let's Double Click on That",
        slug: "double-click",
        corporateDefinition: "To delve deeper into a specific point or sub-topic that was just mentioned during a discussion.",
        theTruth: "I want to aggressively interrogate you about the thing you just mumbled because I don't believe you.",
        passiveAggressiveRating: 9,
        sincerityRating: 4,
        usageJargon: "That's an interesting timeline, Sarah. Let's double click on that Q3 delivery date.",
        usageUnGlossed: "Sarah, there is no way you are finishing that by Q3 and I'm going to prove it right now in front of everyone.",
        seoMetaDescription: "What does 'double click on that' mean in a meeting? Translate this aggressive piece of tech-inspired office jargon.",
        keywords: ["double click on that meaning", "tech jargon in meetings", "corporate phrases", "office slang", "meeting interrogation"],
        relatedTerms: ["deep-dive", "alignment"]
    },
    {
        term: "Pivot",
        slug: "pivot",
        corporateDefinition: "A strategic, agile shift in a company's core business model, product direction, or target audience in response to market feedback.",
        theTruth: "Our original idea failed spectacularly, so we are frantically trying something else before the investors fire us.",
        passiveAggressiveRating: 4,
        sincerityRating: 8,
        usageJargon: "We realized the B2C market was saturated, so we're executing a hard pivot to enterprise B2B software.",
        usageUnGlossed: "Nobody bought our app, so we are going to try selling it to businesses instead.",
        seoMetaDescription: "What does a business 'pivot' really mean? Un-gloss this startup and tech industry buzzword to reveal the truth behind strategic shifts.",
        keywords: ["business pivot meaning", "startup jargon", "strategic pivot", "tech company slang", "agile pivot"],
        relatedTerms: ["agile", "synergy"]
    },
    {
        term: "Agile",
        slug: "agile",
        corporateDefinition: "A project management methodology characterized by the division of tasks into short phases of work and frequent reassessment and adaptation of plans.",
        theTruth: "An excuse to have zero documentation, change the requirements every week, and blame the developers when the project is late.",
        passiveAggressiveRating: 6,
        sincerityRating: 3,
        usageJargon: "We need the team to be highly agile to accommodate the shifting client demands.",
        usageUnGlossed: "The client doesn't know what they want, so you just have to keep rebuilding it until they are happy.",
        seoMetaDescription: "What does 'Agile' mean outside of a pure software context? Decode this management buzzword and its impact on your sanity.",
        keywords: ["agile corporate meaning", "agile buzzword", "project management jargon", "tech industry slang", "office methodologies"],
        relatedTerms: ["pivot", "bandwidth"]
    },
    {
        term: "Herding Cats",
        slug: "herding-cats",
        corporateDefinition: "The difficult logistical challenge of coordinating a group of highly independent, unfocused, or unpredictable individuals toward a common goal.",
        theTruth: "Working with this team is a living nightmare and nobody is listening to me.",
        passiveAggressiveRating: 7,
        sincerityRating: 9,
        usageJargon: "Getting the sales team to adopt the new CRM is like herding cats.",
        usageUnGlossed: "The sales team refuses to do what I tell them and they are driving me insane.",
        seoMetaDescription: "What does the idiom 'herding cats' mean at work? Learn how project managers politely express their extreme frustration.",
        keywords: ["herding cats meaning", "project management idioms", "office frustration slang", "corporate metaphors", "team coordination jargon"],
        relatedTerms: ["alignment", "bandwidth"]
    },
    {
        term: "Put a Pin in It",
        slug: "put-a-pin-in-it",
        corporateDefinition: "To temporarily pause discussion or action on a topic, with the intention of returning to it at a more appropriate or later time.",
        theTruth: "I hate this idea, but I don't want to argue with you right now, so I'm pretending we'll talk about it later. We will not.",
        passiveAggressiveRating: 8,
        sincerityRating: 2,
        usageJargon: "That's a creative solution, but let's put a pin in it until after the merger is finalized.",
        usageUnGlossed: "That idea is terrible. Please stop talking.",
        seoMetaDescription: "What does 'put a pin in it' mean? Decode this classic corporate deflection tactic and learn what your boss is actually saying.",
        keywords: ["put a pin in it meaning", "office jargon", "meeting deflection", "corporate slang", "business idioms"],
        relatedTerms: ["circle-back", "take-this-offline"]
    },
    {
        term: "Run it up the Flagpole",
        slug: "run-it-up-the-flagpole",
        corporateDefinition: "To present an idea, concept, or prototype to a wider audience or leadership team to gauge their reaction and gather feedback.",
        theTruth: "To ask the boss if an idea is stupid before we waste any more time on it.",
        passiveAggressiveRating: 3,
        sincerityRating: 7,
        usageJargon: "Before we commit budget to this, let's run it up the flagpole and see if anyone salutes.",
        usageUnGlossed: "Let's ask the CEO. If he hates it, we drop it immediately.",
        seoMetaDescription: "What is the meaning of 'run it up the flagpole'? Translate this legacy advertising and corporate jargon into plain English.",
        keywords: ["run it up the flagpole meaning", "business idioms", "corporate slang", "testing ideas jargon", "office terminology"],
        relatedTerms: ["alignment", "circle-back"]
    },
    {
        term: "Drink the Kool-Aid",
        slug: "drink-the-kool-aid",
        corporateDefinition: "To demonstrate unquestioning adoption of a company's mission, culture, or strategic directives.",
        theTruth: "To completely lose your grasp on reality and blindly believe the toxic, cult-like nonsense the CEO is spouting.",
        passiveAggressiveRating: 9,
        sincerityRating: 8,
        usageJargon: "If we're going to succeed, we need the whole engineering team to really drink the Kool-Aid on this new framework.",
        usageUnGlossed: "We need everyone to stop complaining and pretend this terrible new system is brilliant.",
        seoMetaDescription: "What does 'drink the Kool-Aid' mean in a corporate setting? Un-gloss this dark metaphor for blind company loyalty.",
        keywords: ["drink the kool aid meaning", "corporate culture slang", "toxic workplace jargon", "business idioms", "blind loyalty idiom"],
        relatedTerms: ["alignment", "thought-leader"]
    },
    {
        term: "Out of Pocket",
        slug: "out-of-pocket",
        corporateDefinition: "Being temporarily unavailable, unreachable, or away from the office context for a specified duration.",
        theTruth: "I am taking a personal day and if you call my phone I will throw it into the ocean.",
        passiveAggressiveRating: 4,
        sincerityRating: 7,
        usageJargon: "Just a heads up, I'll be out of pocket from noon to 3 PM for a family matter.",
        usageUnGlossed: "Do not contact me this afternoon under any circumstances.",
        seoMetaDescription: "What does 'out of pocket' mean at work? Decode this common out-of-office terminology and its boundaries.",
        keywords: ["out of pocket meaning corporate", "unavailable jargon", "OOO slang", "office terminology", "unreachable meaning"],
        relatedTerms: ["bandwidth", "offline"]
    },
    {
        term: "Per My Last Email",
        slug: "per-my-last-email",
        corporateDefinition: "A polite reference to prior written correspondence containing relevant context or instructions that were apparently overlooked.",
        theTruth: "Can you not read? I already answered this exact question. Stop wasting my time.",
        passiveAggressiveRating: 10,
        sincerityRating: 10,
        usageJargon: "Per my last email, the deliverables are due on Friday, not Monday.",
        usageUnGlossed: "I literally just told you this. Read the email I sent five minutes ago.",
        seoMetaDescription: "What is the real meaning of 'Per my last email'? Translate the most passive-aggressive phrase in corporate history.",
        keywords: ["per my last email meaning", "passive aggressive email phrases", "office conflict jargon", "corporate speak", "email etiquette"],
        relatedTerms: ["circle-back", "take-this-offline"]
    },
    {
        term: "Bake It In",
        slug: "bake-it-in",
        corporateDefinition: "To integrate a feature, requirement, or cost directly into the foundation of a product or project plan from its inception.",
        theTruth: "We need to hide this cost or flaw so deeply inside the final product that the client won't notice it.",
        passiveAggressiveRating: 5,
        sincerityRating: 6,
        usageJargon: "We need to make sure the structural integrity testing is fully baked into the Q1 timeline.",
        usageUnGlossed: "Make sure you include time for testing from the start so we don't have to ask for a deadline extension later.",
        seoMetaDescription: "What does 'bake it in' mean in business? Un-gloss this project management and financial jargon.",
        keywords: ["bake it in meaning", "financial jargon", "project management slang", "corporate idioms", "integrate meaning"],
        relatedTerms: ["holistic-approach", "alignment"]
    },
    {
        term: "Core Competency",
        slug: "core-competency",
        corporateDefinition: "A specific factor or foundational capability that a business sees as central to the way it, or its employees, operates and provides value.",
        theTruth: "The one or two things we are actually decent at, before we ruined the company by trying to do ten other things.",
        passiveAggressiveRating: 4,
        sincerityRating: 5,
        usageJargon: "We need to divest from this software division and refocus entirely on our core competencies.",
        usageUnGlossed: "We are terrible at making software, so let's go back to selling shoes.",
        seoMetaDescription: "What is a 'core competency'? Strip the MBA speak away and discover what this foundational business jargon really signifies.",
        keywords: ["core competency meaning", "business strategy jargon", "mba buzzwords", "corporate value terminology", "focus slang"],
        relatedTerms: ["pivot", "synergy"]
    },
    {
        term: "Optics",
        slug: "optics",
        corporateDefinition: "The way a situation, action, or decision is perceived by the public, stakeholders, or employees, regardless of the underlying reality.",
        theTruth: "We don't actually care if we did something wrong, we only care that it makes us look bad on Twitter.",
        passiveAggressiveRating: 8,
        sincerityRating: 3,
        usageJargon: "Firing the entire customer service team right before Christmas isn't great for the optics.",
        usageUnGlossed: "It looks extremely cruel to fire these people before the holidays, which is the only reason we are delaying it.",
        seoMetaDescription: "What do executives mean when they talk about 'optics'? Un-gloss this PR buzzword and learn the truth about corporate perception.",
        keywords: ["optics meaning", "corporate optics", "pr jargon", "public perception terminology", "office politics meaning"],
        relatedTerms: ["alignment", "thought-leader"]
    },
    {
        term: "Actionable",
        slug: "actionable",
        corporateDefinition: "Information, feedback, or data that is clear and specific enough to be immediately acted upon or implemented.",
        theTruth: "Stop giving me vague complaints. Tell me exactly what you want me to do to fix it.",
        passiveAggressiveRating: 7,
        sincerityRating: 8,
        usageJargon: "I appreciate the feedback on the design, but I need something more actionable than 'make it pop'.",
        usageUnGlossed: "I cannot do anything with your useless opinion. Give me an exact instruction.",
        seoMetaDescription: "What makes feedback 'actionable'? Decode this common corporate demand and learn how to actually communicate at work.",
        keywords: ["actionable feedback meaning", "corporate data jargon", "office communication", "action items meaning", "business terminology"],
        relatedTerms: ["low-hanging-fruit", "bandwidth"]
    },
    {
        term: "Level Set",
        slug: "level-set",
        corporateDefinition: "A preliminary meeting or discussion intended to ensure all participants have the same baseline understanding of facts or expectations before proceeding.",
        theTruth: "I assume you have no idea what is going on, so I am going to over-explain everything to you like a child.",
        passiveAggressiveRating: 9,
        sincerityRating: 5,
        usageJargon: "Before we get into the Q4 projections, let's do a quick level-set on the current macroeconomic climate.",
        usageUnGlossed: "You clearly didn't read the brief, so I'm going to spend 10 minutes summarizing it for you.",
        seoMetaDescription: "What does it mean to 'level set' a meeting? Un-gloss this patronizing piece of corporate jargon.",
        keywords: ["level set meaning", "meeting jargon", "corporate buzzwords", "alignment vs level set", "office terminology"],
        relatedTerms: ["alignment", "circle-back"]
    }
];

export function getTermBySlug(slug: string): JargonTerm | undefined {
    return dictionary.find(t => t.slug === slug.toLowerCase());
}

export function getAllTerms(): JargonTerm[] {
    return dictionary;
}
