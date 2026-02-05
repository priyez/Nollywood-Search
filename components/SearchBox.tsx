'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { SEARCH_QUERY, SearchData, SearchHit, Collection } from '@/lib/queries';
import { SearchResults } from './SearchResults';
import { Input } from './ui/Input';
import { Spinner } from './ui/Spinner';
import { Card } from './ui/Card';
import { useRouter } from 'next/navigation';
import { useDebounce, useClickOutside, useKeyboardNavigation } from '@/hooks';

export function SearchBox({ small = false }: { small?: boolean }) {
    const [term, setTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const lastTermRef = useRef('');
    const router = useRouter();

    const [search, { data, loading, error }] = useLazyQuery<SearchData>(
        SEARCH_QUERY,
        {
            fetchPolicy: 'network-only',
            errorPolicy: 'all'
        }
    );

    const performSearch = useCallback((value: string) => {
        if (value.length >= 2) {
            lastTermRef.current = value;
            search({
                variables: {
                    input: {
                        term: value,
                        collections: ['works', 'people'],
                    },
                },
            });
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [search]);

    // Debounce search term
    const debouncedTerm = useDebounce(term, 300);

    useEffect(() => {
        performSearch(debouncedTerm);
    }, [debouncedTerm, performSearch]);

    // Flatten and filter hits for keyboard navigation
    const allHits = useMemo(() => {
        const collections = data?.search.collections || [];
        return collections
            .flatMap((collection: Collection) => collection.hits)
            .filter((hit: SearchHit) => {
                if (hit.__typename === 'WorkSearchHit') return !!hit.work;
                if (hit.__typename === 'PersonSearchHit') return !!hit.person;
                return false;
            });
    }, [data]);

    const handleSelect = (hit: SearchHit) => {
        setIsOpen(false);
        if (hit.__typename === 'WorkSearchHit') {
            router.push(`/work/${hit.work.slug}`);
        } else {
            router.push(`/person/${hit.person.slug}`);
        }
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
        inputRef.current?.blur();
    }, []);

    const { selectedIndex, handleKeyDown } = useKeyboardNavigation({
        items: allHits,
        onSelect: handleSelect,
        onClose: handleClose,
    });

    useClickOutside(menuRef, () => setIsOpen(false));

    return (
        <div ref={menuRef} className="relative w-full">
            <div className="relative">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search movies, TV shows, and people..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (term.length >= 2) setIsOpen(true);
                    }}
                    className={`w-full border-2 border-gray-200 rounded-full 
                        focus:border-black focus:outline-none transition-colors
                        placeholder:text-gray-400 ${small ? 'px-4 py-2 text-sm' : 'px-6 py-4 text-lg'}`}
                />
                {loading && (
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${small ? 'scale-75' : ''}`}>
                        <Spinner />
                    </div>
                )}
            </div>

            {isOpen && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden
                    max-h-[70vh] md:max-h-[500px]
                    shadow-2xl border border-gray-100 ring-1 ring-black/5">
                    <SearchResults
                        data={data}
                        error={error?.message}
                        selectedIndex={selectedIndex}
                        onSelect={handleSelect}
                        term={term}
                    />
                </Card>
            )}
        </div>
    );
}
