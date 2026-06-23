import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { ClassificationResource, CodeItem } from '@/libs/data-access/klass';
import { standardLabel } from '@/utils/filterAndSortClassifications';
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

  const tagsList = (
    <>
      {subjectLabel ? <Tag>{subjectLabel}</Tag> : undefined}
      {classification?.classificationType && (
        <Tag data-color='warning'>{standardLabel(classification.classificationType)}</Tag>
      )}
      <CopyTag text={String(classification?.id) ?? ''} />
    </>
  );
  return (
    <SearchHit
      href={classificationRoute}
      title={classification?.name ?? ''}
      description={classification?.description ?? ''}
      tagsList={tagsList}
    />
  );
};

export { ClassificationSearchHit };
