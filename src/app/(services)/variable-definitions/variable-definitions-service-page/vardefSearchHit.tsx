import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal';

interface VardefSearchHitProps {
  variableDefinition: CompleteResponse;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={1}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} rel='noopener noreferrer'>
          {variableDefinition.name.nb} - {variableDefinition.shortName}
        </Link>
      </Heading>
      <Paragraph className='clamp'>{variableDefinition.definition.nb}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            (variableDefinition.subjectFields ?? []).map((field) => ({
              key: String(field),
              // TODO: Get the title from somewhere
              title: String('placeholder'),
            })),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
