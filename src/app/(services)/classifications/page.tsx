import { fetchAllClassifications } from '@/libs/data/classificationData';
import { fetchClassificationFamilies } from '@/libs/data/classificationFamilyData';
import { Classification, ClassificationFamily } from '@/types/classification';
import ClassificationsServicePage from './classifications-service-page';

export default async function Classifications() {
  const classificationFamilies: ClassificationFamily[] = await fetchClassificationFamilies();

  const allClassifications: Classification[] = await fetchAllClassifications();

  return (
    <ClassificationsServicePage
      rawClassifications={allClassifications}
      rawClassificationFamilies={classificationFamilies}
    />
  );
}
