import { SearchHit } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { highlightMatch, cleanBioText } from '@/lib/textUtils';
import { SearchResultIcon } from './SearchResultIcon';
import { TypeBadge } from './TypeBadge';
import Image from 'next/image';

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
        if (hit.__typename === 'WorkSearchHit') {
            router.prefetch(`/work/${hit.work.slug}`);
        } else {
            router.prefetch(`/person/${hit.person.slug}`);
        }
    };

    const isWork = hit.__typename === 'WorkSearchHit';
    const title = isWork ? hit.work.title : hit.person.name;

    let typeLabel = 'PERSON';
    if (isWork) {
        typeLabel = hit.work.workType === 'MOVIE' ? 'MOVIE' : 'TV SHOW';
    } else {
        // Simple heuristic to detect role from bio
        const bio = hit.person.bio?.toLowerCase() || '';
        if (bio.includes('actor') || bio.includes('actress')) {
            typeLabel = 'ACTOR';
        } else if (bio.includes('director') || bio.includes('filmmaker')) {
            typeLabel = 'DIRECTOR';
        } else if (bio.includes('producer')) {
            typeLabel = 'PRODUCER';
        }
    }

    // Extract image URL safely
    const imageUrl = isWork
        ? hit.work.poster?.thumbnailImageUrl
        : hit.person.headshot?.thumbnailImageUrl;

    // determine snippet text
    const snippet = isWork
        ? `${hit.work.workType === 'MOVIE' ? 'Movie' : 'TV Show'}${hit.work.releaseYear ? ` • ${hit.work.releaseYear}` : ''}`
        : cleanBioText(hit.person.bio);

    return (
        <div
            onClick={() => onSelect(hit)}
            onMouseEnter={handleMouseEnter}
            className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
        >
            <div className="flex-shrink-0 w-10 h-14 relative rounded overflow-hidden bg-gray-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="40px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <SearchResultIcon type={isWork ? 'work' : 'person'} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                        {highlightMatch(title, term)}
                    </h4>
                    <TypeBadge type={typeLabel} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                    {snippet}
                </p>
            </div>
        </div>
    );
}
