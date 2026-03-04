import { visit } from 'unist-util-visit';
import { getAllTerms } from './dictionary';

export default function remarkJargon() {
    // Precompute jargon mapping
    const terms = getAllTerms();
    // Sort by length descending to match longest terms first (e.g., "return on investment" before "return")
    terms.sort((a, b) => b.term.length - a.term.length);

    return (tree: any) => {
        visit(tree, 'text', (node, index, parent) => {
            // Do not transform text inside existing links or headings to avoid SEO/link inception issues
            if (parent && (parent.type === 'link' || parent.type === 'heading')) {
                return;
            }

            let textContent = node.value;
            let replacements: any[] = [];
            let lastIndex = 0;

            // Build a regex that matches any of the terms as whole words (case-insensitive)
            // Need to escape regex characters safely
            const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const termPatterns = terms.map(t => escapeRegExp(t.term)).join('|');
            
            if (!termPatterns) return;

            const regex = new RegExp(`\\b(${termPatterns})\\b`, 'gi');

            let match;
            while ((match = regex.exec(textContent)) !== null) {
                const matchedStr = match[0];
                const startIndex = match.index;

                // Find the term mapping based on case-insensitive match
                const matchedTermObj = terms.find(t => t.term.toLowerCase() === matchedStr.toLowerCase());
                if(!matchedTermObj) continue;

                // Push preceding text as a standard text node if it exists
                if (startIndex > lastIndex) {
                    replacements.push({
                        type: 'text',
                        value: textContent.substring(lastIndex, startIndex)
                    });
                }

                // Push the new link node
                replacements.push({
                    type: 'link',
                    url: `/meaning/${matchedTermObj.slug}`,
                    title: `View definition of ${matchedTermObj.term}`,
                    children: [{ type: 'text', value: matchedStr }]
                });

                lastIndex = regex.lastIndex;
            }

            // Push any remaining text after the final match
            if (lastIndex < textContent.length && replacements.length > 0) {
                replacements.push({
                    type: 'text',
                    value: textContent.substring(lastIndex)
                });
            }

            // Replace the original node with our new array of nodes
            if (replacements.length > 0 && parent && typeof index === 'number') {
                parent.children.splice(index, 1, ...replacements);
                // Return index + replacements.length to skip the nodes we just inserted
                return index + replacements.length;
            }
        });
    };
}
