import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-5 w-5 border-2',
        lg: 'h-8 w-8 border-3'
    };

    return (
        <div
            className={`animate-spin rounded-full border-gray-200 border-b-black ${sizes[size]} ${className}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}
