import { Tag } from '@digdir/designsystemet-react';
import { use } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { SUBJECT_FIELD_BY_CODE } from '@/utils/subjectFieldsMapping';
import { useClassificationContext } from './components/classificationContext';

interface SearchHitProps {
  classification?: ClassificationResource;
}

export const getSubjectCodeByFamilyId = (familyId?: number) => {
  if (familyId == null) return undefined;
  return Object.entries(SUBJECT_FIELD_BY_CODE).find(([, familyIds]) => familyIds.includes(familyId))?.[0];
};

const ClassificationSearchHit = ({ classification }: SearchHitProps) => {
  const { subjectFieldsPromise } = useClassificationContext();
  const { data: subjectFields } = use(subjectFieldsPromise);

  const classificationRoute = `${tabsData.Classifications.route}/${classification?.id}`;
  const subjectCode = getSubjectCodeByFamilyId(classification?.classificationFamilyId);
  const subjectLabel = subjectFields.find((field) => String(field.code) === subjectCode)?.name;

  return (
    <SearchHit
      href={classificationRoute}
      title={classification?.name ?? ''}
      description={`${localization.id}: ${classification?.id ?? '-'}`}
      tagsList={subjectLabel ? <Tag>{subjectLabel}</Tag> : undefined}
    />
  );
};

export { ClassificationSearchHit };
