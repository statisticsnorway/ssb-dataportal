'use server';

import { ClassificationResource } from '@/libs/data-access/klass';
import classificationsMock from '@/static-data/classifications.json';
import { linkObj } from '@/types/classification';
import { getClassification } from '@/utils/mock-data';

const CLASSIFICATIONS_URL_PATH_PART = 'classifications';

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
    console.warn('Using mock classifications');
    allClassifications = classificationsMock.classifications;
  } else {
    console.log(`Using Klass base path: ${process.env.KLASS_BASE_PATH}`);
    while (currentPage < totalPages) {
      const res = await fetch(
        `${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS_URL_PATH_PART}?includeCodelists=true&page=${currentPage}&size=${pageSize}`,
        {
          cache: 'no-store',
        },
      );
      if (!res.ok) {
        console.error(`Request to ${res.url} returned status code ${res.status}`, res);
        throw new Error('Failed to fetch classifications');
      }

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
    console.warn('Using mock classifications');
    classification = getClassification(id);
  } else {
    const res = await fetch(
      `${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS_URL_PATH_PART}/${id}?includeCodelists=true`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      console.error(`Request to ${res.url} returned status code ${res.status}`, res);
      if (res.status === 404) return undefined; // not found
      throw new Error('Failed to fetch classification');
    }

    classification = await res.json();
  }
  return classification;
}
