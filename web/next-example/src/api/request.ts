import { Contributor, Repository } from '@/components/landing/types';

export async function request<T>(apiUrl: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(apiUrl, {
      ...options,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${apiUrl}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

type RepoFetchOptions = {
  owner: string;
  repo: string;
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function fetchRepoData({ owner, repo }: RepoFetchOptions): Promise<Repository> {
  const repoData = await request<Repository>(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  return repoData;
}

export async function fetchRepoContributors({
  owner,
  repo,
}: RepoFetchOptions): Promise<Contributor[]> {
  const contributors = await request<Contributor[]>(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  return contributors;
}

export async function fetchRepoSponsors({ owner, repo }: RepoFetchOptions): Promise<Sponsors> {
  const sponsors = await request<SponsorResponse>(`https://ghs.vercel.app/v3/sponsors/${owner}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return sponsors.sponsors;
}

export type SponsorItem = {
  username: string;
  avatar: string;
};

export type Sponsors = Record<'current' | 'past', SponsorItem[]>;

export type SponsorResponse = {
  status: string;
  sponsors: Sponsors;
};
