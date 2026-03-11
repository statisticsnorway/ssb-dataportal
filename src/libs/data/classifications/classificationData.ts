'use server';

import { ClassificationResource } from '@/libs/data-access/klass';
import { createLogger } from '@/libs/logger/server-logger';
import classificationsMock from '@/static-data/classifications.json';
import { linkObj } from '@/types/classification';
import { getClassification } from '@/utils/mock-data';

const logger = createLogger('classification-data');

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
    logger.warn('Using static mock data for classifications');
    allClassifications = classificationsMock.classifications;
  } else {
    logger.debug({ basePath: process.env.KLASS_BASE_PATH }, 'Klass API base path configured');
    while (currentPage < totalPages) {
      const res = await fetch(
        `${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS_URL_PATH_PART}?includeCodelists=true&page=${currentPage}&size=${pageSize}`,
        {
          cache: 'no-store',
        },
      );
      if (!res.ok) {
        logger.error({ statusCode: res.status, url: res.url }, 'Classification fetch failed');
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
    logger.warn('Using static mock data for classifications');
    classification = getClassification(id);
  } else {
    const res = await fetch(
      `${process.env.KLASS_BASE_PATH}/${CLASSIFICATIONS_URL_PATH_PART}/${id}?includeCodelists=true`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      logger.error({ statusCode: res.status, url: res.url }, 'Classification fetch by ID failed');
      if (res.status === 404) return undefined; // not found
      throw new Error('Failed to fetch classification');
    }

    classification = await res.json();
  }
  return classification;
}
