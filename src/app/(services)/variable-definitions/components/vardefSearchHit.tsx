import { Card, Paragraph } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/tabs';
import { TagsGroup } from '@/components/tags-group';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';
import styles from './vardef.module.css';
import { VardefHeading } from './vardefHeading';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <VardefHeading
        href={`${tabsData.VariableDefinitions.route}/${variableDefinition.id}`}
        headingProps={{ 'data-size': 'md', level: 2 }}
        variableDefinition={variableDefinition}
      ></VardefHeading>
      <Paragraph className={styles.truncateTo3Lines}>{String(variableDefinition.definition)}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagData={
          new Map(
            variableDefinition.subject_fields
              .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
              .map((field) => [field.code, field.title]),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
