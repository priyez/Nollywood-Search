import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPageLayout, PageTitle, Tag } from '@/components/layout';
import { getWorkMetadata, fetchWork } from '@/lib/metadata';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return getWorkMetadata(slug);
}

function formatRuntime(minutes: number | null | undefined): string | null {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="mb-4">
            <h4 className="font-bold text-sm text-gray-900">{label}</h4>
            <p className="text-sm text-gray-600">{value}</p>
        </div>
    );
}

export default async function WorkPage({ params }: Props) {
    const { slug } = await params;

    try {
        const work = await fetchWork(slug);
        if (!work) notFound();

        // Sort cast and crew
        // Create a copy of cast array before sorting to avoid mutating read-only Apollo cache
        const cast = work.cast ? [...work.cast].sort((a, b) => (a.isLead === b.isLead ? 0 : a.isLead ? -1 : 1)) : [];
        const mainCrew = work.crew?.filter(c => ['DIRECTOR', 'WRITER', 'PRODUCER', 'EXECUTIVE PRODUCER'].includes(c.role)) || [];

        return (
            <DetailPageLayout>
                {/* Backdrop Header */}
                <div className="relative w-full h-[40vh] md:h-[50vh] rounded-xl overflow-hidden mb-8 shadow-2xl">
                    {work.backdrop ? (
                        <Image
                            src={work.backdrop.url}
                            alt={work.backdrop.altText || work.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 md:p-10">
                        <div className="text-white max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-md">{work.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base font-medium">
                                {work.releaseYear && <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">{work.releaseYear}</span>}
                                {work.contentRating && work.contentRating !== 'N/A' && <span className="border border-white/40 px-2 py-0.5 rounded">{work.contentRating}</span>}
                                {work.runtime && <span>{formatRuntime(work.runtime)}</span>}
                                <span className="mx-1">•</span>
                                <span>{work.genres.map(g => g.name).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-[250px_1fr] gap-10">
                    {/* Left Column: Poster & Quick Info */}
                    <div className="space-y-6">
                        {/* Poster - Hidden on mobile as it's repetitive with backdrop, shown on desktop */}
                        {work.poster && (
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg -mt-24 md:-mt-20 z-10 border-4 border-white w-48 md:w-full mx-auto md:mx-0">
                                <Image
                                    src={work.poster.url}
                                    alt={work.poster.altText || work.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 192px, 250px"
                                />
                            </div>
                        )}

                        <div className="bg-white md:pt-4">
                            <InfoItem label="Release Date" value={work.releaseDate ? new Date(work.releaseDate).toLocaleDateString() : null} />
                            <InfoItem label="Status" value={work.isInTheatre ? 'In Theatres' : work.isStreamable ? 'Streaming' : 'Released'} />
                            <InfoItem label="Original Language" value={work.languages?.join(', ')} />
                            <InfoItem label="Spoken Languages" value={work.spokenLanguages?.filter(Boolean).join(', ')} />
                        </div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="space-y-10">

                        {/* Synopsis */}
                        <section>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Synopsis</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {work.summary || work.synopsis || "No synopsis available."}
                            </p>
                        </section>

                        {/* Cast */}
                        {cast.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Top Cast</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {cast.slice(0, 8).map((member) => (
                                        <Link
                                            key={member.id}
                                            href={`/person/${member.person.slug}`}
                                            className="group block"
                                        >
                                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 mb-2 shadow-sm group-hover:shadow-md transition-all">
                                                {member.person.headshot ? (
                                                    <Image
                                                        src={member.person.headshot.thumbnailImageUrl}
                                                        alt={member.person.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-sm text-gray-900 leading-tight group-hover:text-black">
                                                {member.person.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate">{member.characterName}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Crew */}
                        {mainCrew.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Key Crew</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                    {mainCrew.map((member) => (
                                        <Link
                                            key={member.id}
                                            href={`/person/${member.person.slug}`}
                                            className="flex items-start gap-3 group"
                                        >
                                            <div className="text-sm">
                                                <h4 className="font-bold text-gray-900 group-hover:text-black">{member.person.name}</h4>
                                                <p className="text-xs text-gray-500">{member.role}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Trailer */}
                        {work.trailer && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Trailer</h3>
                                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                                    <iframe
                                        src={work.trailer.url.replace('watch?v=', 'embed/')}
                                        title={work.trailer.title}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </DetailPageLayout>
        );
    } catch (e) {
        console.error("Error loading work:", e);
        notFound();
    }
}
