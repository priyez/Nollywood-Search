import { ReactNode } from 'react';

interface DetailPageLayoutProps {
    children: ReactNode;
}

/**
 * Reusble layout for detail pages (work, person, etc.)
 */
export function DetailPageLayout({ children }: DetailPageLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
