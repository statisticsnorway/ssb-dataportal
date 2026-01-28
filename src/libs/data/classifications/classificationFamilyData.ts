'use server';

import classificationMockFamilies from '@/static-data/classification-families.json';
import { ClassificationType } from '@/types/classification';
import { transformClassificationFamilies } from '@/utils/mock-data';
import { ClassificationFamilyResource } from '../../data-access/klass';

const CLASSIFICATION_FAMILIES_URL_PATH_PART = 'classificationFamilies';

const useStaticData = process.env.KLASS_USE_STATIC_DATA === 'true';

export async function fetchClassificationFamilies(): Promise<ClassificationFamilyResource[]> {
  let allClassificationFamilies: ClassificationFamilyResource[];

  if (useStaticData) {
    console.log('Using mock classification families');
    allClassificationFamilies = allClassificationFamilies = transformClassificationFamilies(classificationMockFamilies);
  } else {
    const res = await fetch(`${process.env.KLASS_BASE_PATH}/${CLASSIFICATION_FAMILIES_URL_PATH_PART}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch classification families');

    const data = await res.json();
    allClassificationFamilies = data._embedded?.classificationFamilies ?? [];
  }

  return allClassificationFamilies;
}

export const getClassificationFamily = async (
  id: string,
  includeCodelists: boolean,
): Promise<ClassificationFamilyResource> => {
  if (useStaticData) {
    console.log('Using mock classification family');
    const family = classificationMockFamilies.find((f) => String(f.id) === id);
    if (!family) throw new Error(`Mock classification family with id ${id} not found`);
    return {
      id: family.id,
      name: family.name,
      classifications: family.classifications.map((c) => ({
        ...c,
        name: c.name,
        id: c.id,
        classificationType: c.classificationType as ClassificationType,
        lastModified: new Date(c.lastModified), // <-- convert string -> Date
        _links: c._links,
      })),
    };
  } else {
    const data = await fetch(
      `${process.env.KLASS_BASE_PATH}/${CLASSIFICATION_FAMILIES_URL_PATH_PART}/${id}?includeCodelists=${includeCodelists}`,
    );
    return data.json();
  }
};
