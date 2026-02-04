import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', error, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full py-4 pr-4 transition-all duration-200
            bg-white border-2 border-gray-200 rounded-full
            text-gray-900 text-lg placeholder-gray-400
            focus:outline-none focus:border-black
            ${icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500 ml-4">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
