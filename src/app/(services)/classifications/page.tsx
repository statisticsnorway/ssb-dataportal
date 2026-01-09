import { fetchAllClassifications } from '@/libs/data/classificationData';
import { fetchClassificationFamilies } from '@/libs/data/classificationFamilyData';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import ClassificationsServicePage from './classifications-service-page';

export default async function Classifications() {
  const classificationFamilies: ClassificationFamilyResource[] = await fetchClassificationFamilies();

  const allClassifications: ClassificationResource[] = await fetchAllClassifications();

  return (
    <ClassificationsServicePage
      rawClassifications={allClassifications}
      rawClassificationFamilies={classificationFamilies}
    />
  );
}
