import { BrandHeader } from './BrandHeader';
import { SearchBox } from '../SearchBox';
import Link from 'next/link';

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
                <Link href="/" className="flex-shrink-0">
                    <BrandHeader size="sm" align="left" />
                </Link>
                <div className="flex-1 max-w-xl">
                    <SearchBox small={true} />
                </div>
            </div>
        </header>
    );
}
