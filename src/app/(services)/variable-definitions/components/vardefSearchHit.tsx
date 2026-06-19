import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { SearchHit } from '@/components/search-hit';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { StatusTag } from '@/components/tag-components/statusTag';
import { TagsGroup } from '@/components/tag-components/tags-group';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { areFieldsDefinedAndNonNull, getLabelWithParent } from '@/utils/functions';
import { useVariableDefinitionsContext } from '../variable-definitions-service-page/components/variableDefinitionContext';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  const { subjectFields } = useVariableDefinitionsContext();
  const { isAuthenticated } = useAuthContext();

  const subjectFieldOptions = subjectFields.map((item) => ({
    value: String(item.code),
    label: String(item.name),
  }));
  const subjectFieldTags = new Map(
    variableDefinition.subject_fields
      .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
      .map((field) => [field.code, getLabelWithParent(field, subjectFieldOptions)]),
  );

  const vardefRoute = `${tabsData.VariableDefinitions.route}/${variableDefinition.short_name}`;
  const tagsList = (
    <>
      <TagsGroup maxTags={4} tagData={subjectFieldTags} ariaLabel={localization.subjectArea} />
      {isAuthenticated && <StatusTag variableStatus={variableDefinition.variable_status} />}
      <CopyTag text={variableDefinition.short_name} />
    </>
  );

  return (
    <SearchHit
      title={variableDefinition.name ?? ''}
      href={vardefRoute}
      description={String(variableDefinition.definition)}
      tagsList={tagsList}
    />
  );
};

export { VardefSearchHit };
