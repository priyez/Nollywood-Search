import { SearchHit } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { highlightMatch, cleanBioText } from '@/lib/textUtils';
import { SearchResultIcon } from './SearchResultIcon';
import { TypeBadge } from './TypeBadge';

interface SearchResultItemProps {
    hit: SearchHit;
    isSelected: boolean;
    onSelect: (hit: SearchHit) => void;
    term: string;
}

/**
 * Individual search result item component
 */
export function SearchResultItem({ hit, isSelected, onSelect, term }: SearchResultItemProps) {
    const router = useRouter();

    const handleMouseEnter = () => {
        // Prefetch on hover for instant page loads
        if (hit.__typename === 'WorkSearchHit') {
            router.prefetch(`/work/${hit.work.slug}`);
        } else {
            router.prefetch(`/person/${hit.person.slug}`);
        }
    };

    const title = hit.__typename === 'WorkSearchHit' ? hit.work.title : hit.person.name;
    const type = hit.__typename === 'WorkSearchHit' ? hit.work.workType : 'PERSON';
    const snippet = hit.__typename === 'WorkSearchHit'
        ? `${hit.work.workType === 'MOVIE' ? 'Movie' : 'TV Show'}`
        : cleanBioText(hit.person.bio);

    return (
        <div
            onClick={() => onSelect(hit)}
            onMouseEnter={handleMouseEnter}
            className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
        >
            {/* TODO: Use posterPath/profilePath if API provides images in the future */}
            <SearchResultIcon type={hit.__typename === 'WorkSearchHit' ? 'work' : 'person'} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                        {highlightMatch(title, term)}
                    </h4>
                    <TypeBadge type={type as 'MOVIE' | 'TV_SHOW' | 'PERSON'} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                    {snippet}
                </p>
            </div>
        </div>
    );
}
