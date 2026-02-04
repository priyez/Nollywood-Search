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
    if (error) {
        return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
    }

    const collections = data?.search.collections || [];
    const hasResults = collections.some(c => c.found > 0);

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
                if (collection.hits.length === 0) return null;

                return (
                    <div key={collection.name} className="border-b last:border-b-0 border-gray-100">
                        <CollectionHeader
                            displayName={collection.displayName}
                            found={collection.found}
                        />

                        {collection.hits.map((hit: SearchHit, hitIndex: number) => {
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
