import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const isUrl = (str: string) => {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

async function fetchUrlContent(url: string) {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UnglossBot/1.0)' } });
        const html = await response.text();
        // Remove scripts, styles, and tags for a cleaner text representation
        let text = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, ' ')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, ' ')
            .replace(/<[^>]*>?/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return text.length > 5000 ? text.substring(0, 5000) + "..." : text; // Cap for API limits
    } catch (e) {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        let { text, source, mode = "ungloss", toneIntensity = 0 } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        let isDocument = false;
        let originalTextForCount = text;

        if (isUrl(text)) {
            const fetchedContent = await fetchUrlContent(text);
            if (fetchedContent) {
                if (!source) source = text; // Use URL as source if none provided
                text = fetchedContent;
                isDocument = true;
                originalTextForCount = fetchedContent;
            }
        } else if (text.length > 300) {
            isDocument = true;
        }

        const originalWordCount = originalTextForCount.trim().split(/\s+/).length;
        let prompt = "";

        if (mode === "ungloss") {
            prompt = `
      You are the engine behind "Un-gloss", a utility that strips corporate polish to reveal raw, human truth.
      Your persona is the 'Surgical Realist': brutally honest, minimalist, and highly intellectual.

      ${isDocument ? `
      CONTENT TYPE: LONG-FORM DOCUMENT / WEBPAGE
      GOAL: Radically summarize and un-gloss. Strip the entire document down to its CORE TRUTH in 2-3 punchy sentences.
      ` : `
      CONTENT TYPE: SHORT PHRASE
      GOAL: Translate the input into ONE short, punchy sentence (absolute max 18 words).
      `}

      RULES for Translation:
      1. Remove ALL adjectives, marketing fluff, and corporate jargon.
      2. The tone must be dry, sharp, and entirely devoid of "synergy," "alignment," or "leverage."
      3. Never use obscenity.

      RULES for B.S. Meter:
      Evaluate the "B.S. Score" of the original input text from 0 to 100 representing how much meaningless corporate jargon, passive voice, or fluff it contains.

      OUTPUT FORMAT:
      You must return a JSON object with four fields:
      - translation: (string) The translated text.
      - bsScore: (integer) The B.S. Meter score from 0 to 100.
      - standardizedSource: (string) Based on the "Context/Source" provided, return a standardized organization name. If person-based, return "Individual". If none, return "Anonymous".
      - targetWordCount: (integer) The word count of your generated translation.

      ${source ? `Context/Source: ${source}\n` : ""}
      Text to UN-GLOSS: "${text}"
      `;
        } else if (mode === "pivot") {
            prompt = `
      You are the engine behind "Un-gloss", performing a "Professional Pivot".
      Your persona is an 'Expensive PR Firm': extremely polished, deferential, and fluent in C-suite acceptable language.

      TONE INTENSITY LEVEL: ${toneIntensity} out of 100.
      
      OUTPUT FORMAT:
      You must return a JSON object with four fields:
      - translation: (string) The translated text.
      - bsScore: (integer) The B.S. Meter score from 0 to 100.
      - standardizedSource: (string) Based on the "Context/Source" provided, return a standardized organization name.
      - targetWordCount: (integer) The word count of your generated translation.

      ${source ? `Context/Source: ${source}\n` : ""}
      Raw text to PIVOT: "${text}"
      `;
        } else if (mode === "hallucinate") {
            prompt = `
      You are the engine behind "Un-gloss", performing a "Corporate Hallucination".
      
      OUTPUT FORMAT:
      You must return a JSON object with four fields:
      - translation: (string) The hallucinated corporate text.
      - bsScore: (integer) 100.
      - standardizedSource: (string) Standardized organization name.
      - targetWordCount: (integer) Word count.

      ${source ? `Context/Source: ${source}\n` : ""}
      Raw text to HALLUCINATE: "${text}"
      `;
        }

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                translation: { type: Type.STRING },
                bsScore: { type: Type.INTEGER },
                standardizedSource: { type: Type.STRING },
                targetWordCount: { type: Type.INTEGER },
            },
            required: ["translation", "bsScore", "standardizedSource", "targetWordCount"],
        };

        console.log("Gemini Prompt length:", prompt.length);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        console.log("Gemini Response received");

        const resultText = (typeof response.text === 'function' ? await (response as any).text() : response.text)
            || '{"translation": "Analysis failed.", "bsScore": 0, "standardizedSource": "Anonymous", "targetWordCount": 0}';

        let result;
        try {
            result = JSON.parse(resultText);
        } catch (e) {
            console.error("JSON Parse Error:", e, "Text:", resultText);
            result = { translation: "Analysis failed due to response formatting.", bsScore: 0, standardizedSource: "Anonymous", targetWordCount: 0 };
        }

        return NextResponse.json({
            ...result,
            originalWordCount,
            isDocument
        });
    } catch (error: any) {
        console.error("Translation error details:", error);
        return NextResponse.json({
            error: "Failed to translate",
            details: error.message || "Unknown error"
        }, { status: 500 });
    }
}
