import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export const dynamic = 'force-static';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET() {
    try {
        const prompt = `
    Generate a leaderboard of 5 fictional "Global CEOs" for a "C-Suite Hall of Shame".
    These should sound like stereotypical executives but MUST NOT reference real people or companies to avoid defamation.
    Generate a satirical, jargon-heavy quote for each CEO that sounds entirely meaningless but highly corporate.
    Assign a "Buzzword Density Score" (from 0 to 100) for each quote, where 100 means it's pure unfiltered jargon.

    You must return a JSON object with an array called "entries".
    Each object in the array should have:
    - ceoName: (e.g., "Chad V. Cee", "The Legacy Banker", "Synergy Steve")
    - quote: (The highly jargonized satirical quote)
    - densityScore: (number between 0 and 100)
    `;

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                entries: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            ceoName: { type: Type.STRING },
                            quote: { type: Type.STRING },
                            densityScore: { type: Type.INTEGER },
                        },
                        required: ["ceoName", "quote", "densityScore"],
                    },
                },
            },
            required: ["entries"],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const resultText = response.text || '{"entries": []}';
        const result = JSON.parse(resultText);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Leaderboard error:", error);
        return NextResponse.json({ error: "Failed to generate leaderboard" }, { status: 500 });
    }
}
