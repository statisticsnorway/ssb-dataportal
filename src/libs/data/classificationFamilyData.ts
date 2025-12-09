'use server';

import { ClassificationFamily, ClassificationFamilyResponse, ClassificationType } from '@/types/classification';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';
import classificationMockFamilies from './static-data/classification-families.json';

const isTest = process.env.NEXT_TEST === 'test';

export async function fetchClassificationFamilies(): Promise<ClassificationFamily[]> {
  let allClassificationFamilies: ClassificationFamily[];

  if (isTest) {
    console.log('Using mock classification families:', classificationMockFamilies);
    allClassificationFamilies = classificationMockFamilies;
  } else {
    const res = await fetch(`${KLASS_HOST}${CLASSIFICATION_FAMILIES}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch classification families');

    const data = await res.json();
    allClassificationFamilies = data._embedded?.classificationFamilies ?? [];
  }

  return allClassificationFamilies;
}

export const getClassificationFamily = async (
  id: string,
  includeCodelists: boolean,
): Promise<ClassificationFamilyResponse> => {
  if (isTest) {
    console.log('Using mock classification familY:');
    const family = classificationMockFamilies.find((f) => String(f.id) === id);
    if (!family) throw new Error(`Mock classification family with id ${id} not found`);
    return {
      id: family.id,
      name: family.name,
      classifications: family.classifications.map((c) => ({
        ...c,
        classificationType: c.classificationType as ClassificationType,
      })),
    };
  } else {
    const data = await fetch(`${KLASS_HOST}classificationfamilies/${id}?includeCodelists=${includeCodelists}`);
    return data.json();
  }
};
