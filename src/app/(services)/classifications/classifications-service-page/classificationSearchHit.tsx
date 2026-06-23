import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { SearchHit } from '@/components/search-hit';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { ClassificationResource, CodeItem } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import { standardLabel } from '@/utils/filterAndSortClassifications';
import { getSubjectCodeByFamilyId } from '@/utils/subjectFieldsMapping';

interface SearchHitProps {
  classification?: ClassificationResource;
  subjectFields: CodeItem[];
}

const stripTitlePrefix = (name?: string) =>
  (name ?? '')
    .replace(
      new RegExp(
        `^(${localization.classification.codeListPrefix}|${localization.classification.standardPrefix})\\s*`,
        'i',
      ),
      '',
    )
    .trim();

const ClassificationSearchHit = ({ classification, subjectFields }: SearchHitProps) => {
  const classificationRoute = `${tabsData.Classifications.route}/${classification?.id}`;
  const subjectCode = getSubjectCodeByFamilyId(classification?.classificationFamilyId);
  const subjectField = subjectFields.find((field) => String(field.code) === subjectCode);
  const subjectLabel = subjectField?.name ? String(subjectField.name) : undefined;

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const title = capitalize(stripTitlePrefix(classification?.name));

  const tagsList = (
    <>
      {subjectLabel ? <Tag>{subjectLabel}</Tag> : undefined}
      {classification?.classificationType && (
        <Tag data-color='warning'>{standardLabel(classification.classificationType)}</Tag>
      )}
      <CopyTag copyType='id' text={String(classification?.id) ?? ''} />
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
