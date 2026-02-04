import { client } from './apollo-client';
import { GET_WORK, GET_PERSON, WorkData, PersonData } from './queries';
import { Metadata } from 'next';

/**
 * Fetches work metadata for SEO
 */
export async function getWorkMetadata(identifier: string): Promise<Metadata> {
    try {
        const { data } = await client.query<WorkData>({
            query: GET_WORK,
            variables: { identifier },
        });

        const work = data?.getWork;
        if (!work) return { title: 'Work Not Found' };

        return {
            title: `${work.title} - Nollywood.com`,
            description: `${work.workType === 'MOVIE' ? 'Movie' : 'TV Show'}: ${work.title}`,
        };
    } catch (e) {
        return { title: 'Work Not Found' };
    }
}

/**
 * Fetches person metadata for SEO
 */
export async function getPersonMetadata(identifier: string): Promise<Metadata> {
    try {
        const { data } = await client.query<PersonData>({
            query: GET_PERSON,
            variables: { identifier },
        });

        const person = data?.getPerson;
        if (!person) return { title: 'Person Not Found' };

        return {
            title: `${person.name} - Nollywood.com`,
            description: person.bio || `${person.name} - Nollywood`,
        };
    } catch (e) {
        return { title: 'Person Not Found' };
    }
}

/**
 * Fetches work data for page rendering
 */
export async function fetchWork(identifier: string) {
    const { data } = await client.query<WorkData>({
        query: GET_WORK,
        variables: { identifier },
    });
    return data?.getWork;
}

/**
 * Fetches person data for page rendering
 */
export async function fetchPerson(identifier: string) {
    const { data } = await client.query<PersonData>({
        query: GET_PERSON,
        variables: { identifier },
    });
    return data?.getPerson;
}
