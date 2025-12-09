import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { areFieldsDefinedAndNonNull } from '@/utils/functions';
import styles from '../variable-definitions.module.css';

interface VardefSearchHitProps {
  variableDefinition: RenderedView;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={2}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} className={styles.vardefSearchHitHeadingLink}>
          <span>{variableDefinition.name}</span>
          <span className={styles.vardefSearchHitShortName}>{variableDefinition.shortName}</span>
        </Link>
      </Heading>
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
