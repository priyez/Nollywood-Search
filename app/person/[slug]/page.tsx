import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPageLayout, PageTitle } from '@/components/layout';
import { InfoItem, SocialIcon } from '@/components/person';
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
                        <div className="animate-shimmer relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-gray-100">
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
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="opacity-20 scale-[1.5]">
                                        <svg className="w-32 h-32 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
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


