import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { SUBJECT_FIELD_LOOKUP } from '@/libs/data/subjectFieldLookup';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal';
import styles from '../variable-definitions.module.css';

interface VardefSearchHitProps {
  variableDefinition: CompleteResponse;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={2}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} className={styles.vardefSearchHitHeadingLink}>
          <span className={styles.vardefSearchHitName}>{variableDefinition.name.nb}</span>
          {variableDefinition.shortName && (
            <span className={styles.vardefSearchHitShortName}>{variableDefinition.shortName}</span>
          )}
        </Link>
      </Heading>
      <Paragraph className={styles.truncateLines}>{variableDefinition.definition.nb}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            (variableDefinition.subjectFields ?? []).map((field) => ({
              key: field,
              title: SUBJECT_FIELD_LOOKUP[field] ?? field,
            })),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
