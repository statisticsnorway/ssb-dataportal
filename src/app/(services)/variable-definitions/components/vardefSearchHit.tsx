import { Card, Paragraph } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { TagsGroup } from '@/components/tags-group';
import { VardefHeading } from '@/components/vardef-heading';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { areFieldsDefinedAndNonNull, createSubjectAreaLabel } from '@/utils/functions';
import { useVariableDefinitionsContext } from '../variable-definitions-service-page/components/variableDefinitionContext';
import styles from './vardef.module.css';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  const { subjectFilters } = useVariableDefinitionsContext();
  return (
    <Card data-testid='vardef-search-card'>
      <VardefHeading
        href={`${tabsData.VariableDefinitions.route}/${variableDefinition.short_name}`}
        headingProps={{ 'data-size': 'md', level: 2 }}
        variableDefinition={variableDefinition}
      ></VardefHeading>
      <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{String(variableDefinition.definition)}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagData={
          new Map(
            variableDefinition.subject_fields
              .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
              .map((field) => [field.code, createSubjectAreaLabel(field.code, field.title, subjectFilters)]),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
