import { ReactNode } from 'react';

interface PageTitleProps {
    children: ReactNode;
}

/**
 * Large, bold page title component
 */
export function PageTitle({ children }: PageTitleProps) {
    return (
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">
            {children}
        </h1>
    );
}
