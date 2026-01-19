'use server';

import classificationsMock from '@/static-data/classifications.json';
import { linkObj } from '@/types/classification';
import { CLASSIFICATIONS } from '@/utils/constants';
import { getClassification } from '@/utils/mock-data';
import { ClassificationResource } from '../../data-access/klass';

const useStaticData = process.env.KLASS_USE_STATIC_DATA === 'true';

export interface ClassificationResponse {
  classifications: ClassificationResource[];
  pageInfo: number;
  links: linkObj[];
}

export async function fetchAllClassifications(pageSize = 20): Promise<ClassificationResource[]> {
  let allClassifications = [];
  let currentPage = 0;
  let totalPages = 1;

  if (useStaticData) {
    console.log('Using mock classifications:', classificationsMock.classifications);
    allClassifications = classificationsMock.classifications;
  } else {
    while (currentPage < totalPages) {
      const res = await fetch(
        `${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS}?includeCodelists=true&page=${currentPage}&size=${pageSize}`,
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

export async function fetchClassificationById(id: number): Promise<ClassificationResource | undefined> {
  let classification: ClassificationResource | undefined;

  if (useStaticData) {
    console.log('Using mock classifications:', classificationsMock.classifications);
    classification = getClassification(id);
  } else {
    const res = await fetch(`${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS}/${id}?includeCodelists=true`, {
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
