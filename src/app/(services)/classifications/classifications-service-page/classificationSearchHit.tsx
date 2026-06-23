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

/**
 * Removes classifications prefixes from a classification name.
 *
 * Matches either `classification.codeListPrefix` or `classification.standardPrefix`
 * (case-insensitive) when it appears at the start of the string, then trims
 * surrounding whitespace.
 *
 * @param name - The raw classification title.
 * @returns The title without a known prefix, trimmed. Returns an empty string when `name` is undefined.
 */
const stripTitlePrefix = (name?: string) => {
  const value = name ?? '';
  const prefixes = [localization.classification.codeListPrefix, localization.classification.standardPrefix].filter(
    Boolean,
  ) as string[];

  const matchedPrefix = prefixes.find((prefix) => value.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()));

  return (matchedPrefix ? value.slice(matchedPrefix.length) : value).trim();
};

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
