import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPageLayout, PageTitle } from '@/components/layout';
import { getPersonMetadata, fetchPerson } from '@/lib/metadata';
import { cleanBioText } from '@/lib/textUtils';

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

        return (
            <DetailPageLayout>
                <PageTitle>{person.name}</PageTitle>

                <h2 className="text-xl font-bold mb-3">Biography</h2>

                <p className="text-lg text-gray-700 leading-relaxed">
                    {person.bio ? cleanBioText(person.bio) : 'No biography available.'}
                </p>
            </DetailPageLayout>
        );
    } catch (e) {
        notFound();
    }
}
