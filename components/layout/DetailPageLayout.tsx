import { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';

interface DetailPageLayoutProps {
    children: ReactNode;
}

/**
 * Reusble layout for detail pages (work, person, etc.)
 */
export function DetailPageLayout({ children }: DetailPageLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            <SiteHeader />
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
