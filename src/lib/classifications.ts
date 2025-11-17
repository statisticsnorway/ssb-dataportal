import { Classification, linkObj } from '@/types/classification';
import { CLASSIFICATIONS, KLASS_HOST } from '@/utils/constants';

//const KLASS_HOST = process.env.KLASS_HOST;

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
