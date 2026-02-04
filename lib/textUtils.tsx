/**
 * Highlights matching text in a string by wrapping matches in <strong> tags
 */
export const highlightMatch = (text: string, term: string) => {
    if (!term || term.length < 2) return text;

    // Escape special regex characters
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? <strong key={i} className="font-bold text-black">{part}</strong> : part
    );
};

/**
 * Cleans bio text by removing markdown formatting and extracting meaningful snippet
 * The bio text to clean (may contain markdown)
 * Cleaned text snippet or "No description"
 */
export const cleanBioText = (bio: string | null): string => {
    if (!bio) return 'No description';

    // Remove markdown bold syntax
    let cleaned = bio.replace(/\*\*/g, '');

    // Replace newlines with spaces
    cleaned = cleaned.replace(/\\n/g, ' ').replace(/\n/g, ' ');

    // Remove multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Extract first meaningful sentence or 120 characters
    const firstSentence = cleaned.split(/[.!?]\s/)[0];
    if (firstSentence.length > 0 && firstSentence.length < 120) {
        return firstSentence + '.';
    }

    return cleaned.substring(0, 120) + (cleaned.length > 120 ? '...' : '');
};
