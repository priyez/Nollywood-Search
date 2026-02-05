import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPageLayout, PageTitle } from '@/components/layout';
import { getPersonMetadata, fetchPerson } from '@/lib/metadata';
import { cleanBioText, getKnownFor, formatDate, calculateAge } from '@/lib/textUtils';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return getPersonMetadata(slug);
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


export default async function PersonPage({ params }: Props) {
    const { slug } = await params;

    try {
        const person = await fetchPerson(slug);
        if (!person) notFound();

        // Calculate age manually if not provided by API
        const age = person.age || (person.birthDate ? calculateAge(person.birthDate) : null);

        const works = person.works?.items ? [...person.works.items] : [];
        const sortedWorks = works
            .sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0))
            .slice(0, 8);

        return (
            <DetailPageLayout>
                <div className="grid md:grid-cols-[300px_1fr] gap-8">
                    {/* Left Column: Sidebar */}
                    <div className="space-y-8">
                        {/* Headshot */}
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-gray-100">
                            {person.headshot ? (
                                <Image
                                    src={person.headshot.url}
                                    alt={person.headshot.altText || person.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 300px"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Personal Info Sidebar */}
                        <div className="bg-white">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Personal Info</h3>

                            <InfoItem label="Known For" value={getKnownFor(person.bio)} />
                            <InfoItem label="Gender" value={person.gender === 'MALE' ? 'Male' : person.gender === 'FEMALE' ? 'Female' : person.gender} />

                            {person.birthDate && (
                                <InfoItem
                                    label="Born"
                                    value={`${formatDate(person.birthDate)}${person.birthPlace ? ` in ${person.birthPlace}` : ''}`}
                                />
                            )}

                            <InfoItem label="Age" value={age?.toString()} />

                            {person.deceased && person.deathDate && (
                                <InfoItem label="Died" value={formatDate(person.deathDate)} />
                            )}

                            {person.aliases && person.aliases.length > 0 && (
                                <InfoItem label="Also Known As" value={person.aliases.join(', ')} />
                            )}
                        </div>

                        {/* Social Links */}
                        {person.externalLinks && person.externalLinks.length > 0 && (
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                {person.externalLinks.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-black transition-colors"
                                        title={link.platform || 'Social Link'}
                                    >
                                        <SocialIcon platform={link.platform} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Main Content */}
                    <div>
                        <PageTitle>{person.name}</PageTitle>

                        <div className="mb-10">
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Biography</h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[1.05rem]">
                                {person.bio ? cleanBioText(person.bio) : `We don't have a biography for ${person.name}.`}
                            </div>
                        </div>

                        {/* Known For Section */}
                        {sortedWorks.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Known For</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {sortedWorks.map((work) => (
                                        <Link
                                            key={work.id}
                                            href={`/work/${work.slug}`}
                                            className="group block"
                                        >
                                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-all mb-2">
                                                {work.poster ? (
                                                    <Image
                                                        src={work.poster.thumbnailImageUrl}
                                                        alt={work.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                                        <span className="text-xs">No Poster</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-sm text-gray-900 leading-tight group-hover:text-black mb-1">
                                                {work.title}
                                            </h4>
                                            {work.releaseYear && (
                                                <p className="text-xs text-gray-500">{work.releaseYear}</p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DetailPageLayout>
        );
    } catch (e) {
        console.error("Error loading person:", e);
        notFound();
    }
}

function SocialIcon({ platform }: { platform: string | null }) {
    // Simple icon fallback
    if (platform === 'Instagram') {
        return (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        );
    }

    return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-5.891 1.682-10.166 2.033-12.214.351 2.048 1.469 6.323 2.033 12.214h-4.066zm7.003-8.7c.365 1.059.662 2.222.877 3.44h-5.918c-.287-2.673-.665-4.868-.908-5.95 2.193.308 4.316 1.155 5.949 2.51zm-5.049-5.31c-.136 1.111-.37 2.65-.609 4.25-2.073-1.604-4.577-2.605-7.272-2.784 1.714-1.921 4.192-3.232 6.965-3.528.329.351.621.722.916 1.062zm-3.006 17.022c-1.455-1.874-2.483-4.102-2.906-6.471h4.093c.277 2.188.599 4.332.895 5.253-2.082-.363-3.662-1.218-5.267-2.222 1.082 1.579 2.185 2.87 3.185 3.44zm8.016-1.12c-.521 1.018-1.259 1.944-2.158 2.766-.693-1.114-1.393-2.64-1.771-3.764 2.268.046 3.929.998 3.929.998zm-11.96-10.022c.215-1.218.512-2.381.877-3.44 1.633-1.355 3.756-2.202 5.949-2.51-.243 1.082-.621 3.277-.908 5.95h-5.918zm.667 8.001c-.139 1.115-.229 2.138-.28 3.018-2.695.179-5.199 1.18-7.272 2.784-.239-1.6-.473-3.139-.609-4.25.916 1.062 1.208 1.433 1.537 1.784 2.773-.296 5.251-1.607 6.965-3.528 1.0.57 2.103 1.861 3.185 3.44-1.605 1.004-3.185 1.859-5.267 2.222.296-.921.618-3.065.895-5.253h4.093c-.423 2.369-1.451 4.597-2.906 6.471.309-1.144.64-2.784.877-4.004h5.918c-.287 2.673-.665 4.868-.908 5.95 2.193-.308 4.316-1.155 5.949-2.51.365-1.059.662-2.222.877-3.44h-5.918z" />
        </svg>
    );
}
