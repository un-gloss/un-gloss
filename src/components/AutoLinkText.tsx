import React from 'react';
import Link from 'next/link';
import { getAllTerms } from '@/lib/dictionary';

export default function AutoLinkText({ text }: { text: string }) {
    if (!text) return null;

    const terms = getAllTerms().sort((a, b) => b.term.length - a.term.length);
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const termPatterns = terms.map(t => escapeRegExp(t.term)).join('|');
    
    if (!termPatterns) return <>{text}</>;

    const regex = new RegExp(`\\b(${termPatterns})\\b`, 'gi');
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const matchedStr = match[0];
        const startIndex = match.index;

        if (startIndex > lastIndex) {
            parts.push(text.substring(lastIndex, startIndex));
        }

        const matchedTermObj = terms.find(t => t.term.toLowerCase() === matchedStr.toLowerCase());
        if (matchedTermObj) {
            parts.push(
                <Link 
                    key={`${matchedTermObj.slug}-${startIndex}`} 
                    href={`/meaning/${matchedTermObj.slug}`} 
                    className="auto-linked-term"
                    style={{ color: 'var(--electric-blue)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    title={`View definition for ${matchedTermObj.term}`}
                >
                    {matchedStr}
                </Link>
            );
        } else {
            parts.push(matchedStr);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return <>{parts}</>;
}
