import { Tag } from '@statisticsnorway/design-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { ClassificationResource, CodeItem } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { getSubjectCodeByFamilyId } from '@/utils/subjectFieldsMapping';

interface SearchHitProps {
  classification?: ClassificationResource;
  subjectFields: CodeItem[];
}

const ClassificationSearchHit = ({ classification, subjectFields }: SearchHitProps) => {
  const classificationRoute = `${tabsData.Classifications.route}/${classification?.id}`;
  const subjectCode = getSubjectCodeByFamilyId(classification?.classificationFamilyId);
  const subjectField = subjectFields.find((field) => String(field.code) === subjectCode);
  const subjectLabel = subjectField?.name ? String(subjectField.name) : undefined;

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
