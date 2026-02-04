import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white border border-gray-100 rounded-2xl shadow-sm
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
