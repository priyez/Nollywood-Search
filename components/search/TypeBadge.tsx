interface TypeBadgeProps {
    type: string;
}

/**
 * Badge component
 */
export function TypeBadge({ type }: TypeBadgeProps) {
    return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">
            {type}
        </span>
    );
}
