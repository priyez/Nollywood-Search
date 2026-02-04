import { useState, useCallback } from 'react';

interface UseKeyboardNavigationOptions<T> {
    items: T[];
    onSelect: (item: T) => void;
    onClose?: () => void;
}

/**
 * Custom hook for keyboard navigation through a list of items
*/
export function useKeyboardNavigation<T>({
    items,
    onSelect,
    onClose,
}: UseKeyboardNavigationOptions<T>) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < items.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    onSelect(items[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                if (onClose) {
                    onClose();
                }
            }
        },
        [items, selectedIndex, onSelect, onClose]
    );

    return {
        selectedIndex,
        setSelectedIndex,
        handleKeyDown,
    };
}
