import { Card, Paragraph } from '@digdir/designsystemet-react';
import { TagsGroup } from '@/components/tags-group';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';
import styles from '../variable-definitions.module.css';
import { VardefHeading } from './vardefHeading';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <VardefHeading
        href={`/variable-definitions/${variableDefinition.id}`}
        headingProps={{ 'data-size': 'xl', level: 2 }}
        variableDefinition={variableDefinition}
      ></VardefHeading>
      <Paragraph className={styles.truncateTo3Lines}>{variableDefinition.definition}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            variableDefinition.subjectFields
              .filter((ref) => areFieldsDefinedAndNonNull(ref, ['code', 'title']))
              .map((field) => ({
                key: field.code,
                title: field.title,
              })),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
