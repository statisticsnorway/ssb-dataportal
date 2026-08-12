import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { getClassificationTypeFromString } from '@/types/classification';
import { KlassCode } from '@/types/klass-codes';
import { getLabelForClassificationType, stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
import { getSubjectCodeByFamilyId } from '@/utils/subjectFieldsMapping';

interface SearchHitProps {
  classification: ClassificationWithLanguage;
  subjectFields: KlassCode[];
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
          {getLabelForClassificationType(getClassificationTypeFromString(classification.classificationType))}
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
      fallBackLanguage={classification?.fallbackLanguage ?? undefined}
    />
  );
};

export { ClassificationSearchHit };
