import { SearchData, SearchHit, Collection } from '@/lib/queries';
import { CollectionHeader, SearchResultItem } from './search';

interface SearchResultsProps {
    data?: SearchData;
    error?: string;
    selectedIndex: number;
    onSelect: (hit: SearchHit) => void;
    term: string;
}

export function SearchResults({ data, error, selectedIndex, onSelect, term }: SearchResultsProps) {
    const collections = data?.search.collections || [];
    const hasResults = collections.some(c => c.found > 0);

    // If we have an error but also have partial data, we can still show results
    // and maybe show a small toast or warning later. 
    // If we have NO data and an error, show the error.
    if (error && !hasResults) {
        // Special handling for the "Work not found" error to be less scary
        if (error.includes('not found')) {
            return (
                <div className="p-8 text-center text-gray-500">
                    No results found for "<span className="font-semibold">{term}</span>"
                </div>
            );
        }
        return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
    }

    if (!hasResults && term.length >= 2) {
        return (
            <div className="p-8 text-center text-gray-500">
                No results found for "<span className="font-semibold">{term}</span>"
            </div>
        );
    }

    let hitCounter = 0;

    return (
        <div className="max-h-[70vh] overflow-y-auto">
            {collections.map((collection: Collection) => {
                // Filter valid hits first to check if we should show the collection
                const validHits = collection.hits.filter((hit: SearchHit) => {
                    if (hit.__typename === 'WorkSearchHit') return !!hit.work;
                    if (hit.__typename === 'PersonSearchHit') return !!hit.person;
                    return false;
                });

                if (validHits.length === 0) return null;

                return (
                    <div key={collection.name} className="border-b last:border-b-0 border-gray-100">
                        <CollectionHeader
                            displayName={collection.displayName}
                            found={validHits.length} // Use count of valid hits
                        />

                        {validHits.map((hit: SearchHit, hitIndex: number) => {
                            const currentIdx = hitCounter++;
                            const isSelected = currentIdx === selectedIndex;
                            const uniqueKey = `${collection.name}-${hit.__typename}-${hitIndex}`;

                            return (
                                <SearchResultItem
                                    key={uniqueKey}
                                    hit={hit}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                    term={term}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
