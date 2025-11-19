'use server';

import { Classification, linkObj } from '@/types/classification';
import { CLASSIFICATIONS, KLASS_HOST } from '@/utils/constants';

export interface ClassificationResponse {
  classifications: Classification[];
  pageInfo: number;
  links: linkObj[];
}

export async function fetchClassifications({
  page = '0',
  size = '20',
  includeCodelists = false,
}: {
  page?: string;
  size?: string;
  includeCodelists?: boolean;
}): Promise<ClassificationResponse> {
  const url = `${KLASS_HOST}${CLASSIFICATIONS}?includeCodelists=${includeCodelists}&page=${page}&size=${size}`;
  console.log('Fetching from external API:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API returned error:', response.status, errorText);
      throw new Error(`External API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return {
      classifications: data._embedded.classifications ?? [],
      pageInfo: data.page,
      links: data._links,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchAllClassifications(pageSize = 20): Promise<Classification[]> {
  const allClassifications = [];
  let currentPage = 0;
  let totalPages = 1;

  while (currentPage < totalPages) {
    const res = await fetch(
      `${KLASS_HOST}${CLASSIFICATIONS}?includeCodelists=true&page=${currentPage}&size=${pageSize}`,
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) throw new Error('Failed to fetch classifications');

    const data = await res.json();

    allClassifications.push(...data._embedded.classifications);

    totalPages = data.page?.totalPages ?? totalPages;
    currentPage++;
  }

  return allClassifications;
}
