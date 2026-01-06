'use server';

import classificationsMock from '@/static-data/classifications.json';
import { linkObj } from '@/types/classification';
import { CLASSIFICATIONS, KLASS_HOST } from '@/utils/constants';
import { ClassificationResource } from '../data-access/klass';

const isTest = process.env.NEXT_TEST === 'test';

export interface ClassificationResponse {
  classifications: ClassificationResource[];
  pageInfo: number;
  links: linkObj[];
}

export async function fetchAllClassifications(pageSize = 20): Promise<ClassificationResource[]> {
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
