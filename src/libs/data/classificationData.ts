'use server';

import classificationsMock from '@/static-data/classifications.json';
import { Classification, linkObj } from '@/types/classification';
import { CLASSIFICATIONS, KLASS_HOST } from '@/utils/constants';
import { getClassification } from '@/utils/mock-data';

const isTest = process.env.NEXT_TEST === 'test';

export interface ClassificationResponse {
  classifications: Classification[];
  pageInfo: number;
  links: linkObj[];
}

export async function fetchAllClassifications(pageSize = 20): Promise<Classification[]> {
  let allClassifications = [];
  let currentPage = 0;
  let totalPages = 1;

  if (isTest) {
    console.log('Using mock classifications:', classificationsMock.classifications);
    allClassifications = classificationsMock.classifications;
  } else {
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
  }

  return allClassifications;
}

export async function fetchClassificationById(id: number): Promise<Classification | undefined> {
  let classification: Classification | undefined;

  if (isTest) {
    console.log('Using mock classifications:', classificationsMock.classifications);
    classification = getClassification(id);
  } else {
    const res = await fetch(`${KLASS_HOST}${CLASSIFICATIONS}/${id}?includeCodelists=true`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return undefined; // not found
      throw new Error('Failed to fetch classification');
    }

    classification = await res.json();
  }
  return classification;
}
