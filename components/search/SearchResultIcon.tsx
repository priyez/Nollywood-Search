interface SearchResultIconProps {
    type: 'work' | 'person';
}

/**
 * Icon component for search results (movie/TV or person)
 */
export function SearchResultIcon({ type }: SearchResultIconProps) {
    const baseClasses = "mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center";
    const colorClasses = type === 'work' ? 'bg-gray-100 text-black' : 'bg-gray-200 text-black';

    return (
        <div className={`${baseClasses} ${colorClasses}`}>
            {type === 'work' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            )}
        </div>
    );
}
