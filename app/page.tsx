import { Metadata } from 'next';
import { SearchBox } from '@/components/SearchBox';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nollywood.com Search – Movies, TV Shows & Stars',
  description: 'The digital operating system for Nollywood. Search for your favorite movies, TV shows, actors, and directors.',
  openGraph: {
    title: 'Nollywood.com Search',
    description: 'Find everything Nollywood. Movies, TV shows, and people.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">


      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-black mb-2">
            Nollywood
          </h1>
          <p className="text-gray-500 font-medium text-right uppercase text-[10px]">
            The Digital Operating System
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl z-10">
          <SearchBox />
        </div>

        {/* Quick Links / Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button className="shadow-lg shadow-gray-200">
            I'm Feeling Lucky
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-50 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Nollywood.com. Powering the Nollywood and African Film/TV value chain.
        </p>
      </footer>
    </div>
  );
}
