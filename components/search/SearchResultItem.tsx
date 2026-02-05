import { SearchHit } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { highlightMatch, cleanBioText, getKnownFor } from '@/lib/textUtils';
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

    const isWork = hit.__typename === 'WorkSearchHit';
    const work = isWork ? hit.work : null;
    const person = isWork ? null : hit.person;

    // Safety check: if the hit is null or missing the expected data, don't render it
    if ((isWork && !work) || (!isWork && !person)) {
        return null;
    }

    const handleMouseEnter = () => {
        if (isWork && work?.slug) {
            router.prefetch(`/work/${work.slug}`);
        } else if (person?.slug) {
            router.prefetch(`/person/${person.slug}`);
        }
    };

    const title = isWork ? work!.title : person!.name;

    let typeLabel = 'PERSON';
    if (isWork) {
        typeLabel = work!.workType === 'MOVIE' ? 'MOVIE' : 'TV SHOW';
    } else {
        typeLabel = getKnownFor(person!.bio).toUpperCase();
        if (typeLabel === 'ENTERTAINMENT') typeLabel = 'PERSON';
        if (typeLabel === 'ACTING') typeLabel = 'ACTOR';
        if (typeLabel === 'DIRECTING') typeLabel = 'DIRECTOR';
        if (typeLabel === 'PRODUCTION') typeLabel = 'PRODUCER';
    }

    // Extract image URL safely
    const imageUrl = isWork
        ? work?.poster?.thumbnailImageUrl
        : person?.headshot?.thumbnailImageUrl;

    // determine snippet text
    const snippet = isWork
        ? `${work!.workType === 'MOVIE' ? 'Movie' : 'TV Show'}${work!.releaseYear ? ` • ${work!.releaseYear}` : ''}`
        : cleanBioText(person!.bio);

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
