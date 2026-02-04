import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPageLayout, PageTitle, Tag } from '@/components/layout';
import { getWorkMetadata, fetchWork } from '@/lib/metadata';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return getWorkMetadata(slug);
}

export default async function WorkPage({ params }: Props) {
    const { slug } = await params;

    try {
        const work = await fetchWork(slug);
        if (!work) notFound();

        return (
            <DetailPageLayout>
                <PageTitle>{work.title}</PageTitle>

                <div className="flex gap-3 mb-6">
                    <Tag>{work.workType}</Tag>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                    {work.workType === 'MOVIE' ? 'Movie' : 'TV Show'}
                </p>
            </DetailPageLayout>
        );
    } catch (e) {
        notFound();
    }
}
