import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { TagsGroup } from '@/components/tags-group';
import { VariableDefinitionType } from '@/types/variableDefinition';

interface VardefSearchHitProps {
  variableDefinition: VariableDefinitionType;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Heading data-size='xl' level={1}>
        <Link href={`/variable-definitions/${variableDefinition.id}`} rel='noopener noreferrer'>
          {variableDefinition.name} - {variableDefinition.short_name}
        </Link>
      </Heading>
      <Paragraph className='clamp'>{variableDefinition.definition}</Paragraph>
      <TagsGroup
        maxTags={4}
        tagsData={
          new Set(
            (variableDefinition.subject_fields ?? []).map((subject_field) => ({
              key: String(subject_field.code),
              title: String(subject_field.title),
            })),
          )
        }
      />
    </Card>
  );
};

export { VardefSearchHit };
