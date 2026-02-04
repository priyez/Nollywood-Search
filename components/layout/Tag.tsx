interface TagProps {
    children: string;
}

/**
 * Tag/badge component for displaying categories, types, etc.
 */
export function Tag({ children }: TagProps) {
    return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium whitespace-nowrap">
            {children}
        </span>
    );
}
