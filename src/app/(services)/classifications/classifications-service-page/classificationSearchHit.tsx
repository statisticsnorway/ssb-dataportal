import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { ClassificationResource, CodeItem } from '@/libs/data-access/klass';
import { ClassificationType } from '@/types/classification';
import { getLabelForClassificationType, stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
import { getSubjectCodeByFamilyId } from '@/utils/subjectFieldsMapping';

interface SearchHitProps {
  classification?: ClassificationResource;
  subjectFields: CodeItem[];
}

const ClassificationSearchHit = ({ classification, subjectFields }: SearchHitProps) => {
  const classificationRoute = `${tabsData.Classifications.route}/${classification?.id}`;
  const subjectCode = getSubjectCodeByFamilyId(classification?.classificationFamilyId, classification?.id);
  const subjectField = subjectFields.find((field) => String(field.code) === subjectCode);
  const subjectLabel = subjectField?.name ? String(subjectField.name) : undefined;

  const title = stripTitlePrefix(classification?.name);

  const tagsList = (
    <>
      {subjectLabel ? <Tag>{subjectLabel}</Tag> : undefined}
      {classification?.classificationType && (
        <Tag data-color='warning'>
          {getLabelForClassificationType(classification.classificationType as ClassificationType)}
        </Tag>
      )}
    </>
  );
  return (
    <SearchHit
      href={classificationRoute}
      title={title}
      description={classification?.description ?? ''}
      tagsList={tagsList}
    />
  );
};

export { ClassificationSearchHit };
