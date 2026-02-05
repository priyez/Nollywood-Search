export interface BrandHeaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    align?: 'left' | 'center' | 'right';
}

export function BrandHeader({ className = "", size = 'lg', align = 'center' }: BrandHeaderProps) {
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };
    const titleSizes = {
        sm: 'text-xl',
        md: 'text-4xl',
        lg: 'text-4xl md:text-7xl',
        xl: 'text-6xl md:text-8xl'
    };

    const subtitleSizes = {
        sm: 'text-[6px]',
        md: 'text-[9px]',
        lg: 'text-[10px]',
        xl: 'text-[12px]'
    };

    return (
        <div className={`${alignmentClasses[align]} ${className}`}>
            <h1 className={`${titleSizes[size]} font-black tracking-tighter text-black mb-2`}>
                Nollywood
            </h1>
            <p className={`text-gray-500 font-medium tracking-tighter uppercase ${alignmentClasses[align]} ${subtitleSizes[size]}`}>
                The Digital Operating System
            </p>
        </div>
    );
}
