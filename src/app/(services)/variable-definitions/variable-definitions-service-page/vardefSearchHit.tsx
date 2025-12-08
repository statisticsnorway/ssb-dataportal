import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { SUBJECT_FIELD_LOOKUP } from '@/libs/data/subjectFieldLookup';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { fieldsNotNull, NonNullableFields } from '@/utils/functions';
import styles from '../variable-definitions.module.css';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={2}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} className={styles.vardefSearchHitHeadingLink}>
          <span className={styles.vardefSearchHitName}>{variableDefinition.name}</span>
          {variableDefinition.shortName && (
            <span className={styles.vardefSearchHitShortName}>{variableDefinition.shortName}</span>
          )}
        </Link>
      </Heading>
      <Paragraph className={styles.truncateTo3Lines}>{variableDefinition.definition}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            variableDefinition.subjectFields.filter(fieldsNotNull).map((field) => ({
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
