interface CollectionHeaderProps {
    displayName: string;
    found: number;
}

/**
 * Header component showing collectin name and result count
 */
export function CollectionHeader({ displayName, found }: CollectionHeaderProps) {
    const singularName = displayName.slice(0, -1).toLowerCase();
    const pluralName = displayName.toLowerCase();

    return (
        <div className="px-4 py-2 bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">
                Found {found} {found === 1 ? singularName : pluralName}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {displayName}
            </div>
        </div>
    );
}
