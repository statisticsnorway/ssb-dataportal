import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { VariableDefinitionType } from '@/types/variableDefinition';

interface VardefSearchHitProps {
  variableDefinition: VariableDefinitionType;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <Card>
      <Link href='https://hmpg.net/' rel='noopener noreferrer'>
        <Heading data-size='xl' level={1}>
          {variableDefinition.name} - {variableDefinition.short_name}
        </Heading>
      </Link>
      <Paragraph className="clamp">{variableDefinition.definition}</Paragraph>
        {/* TODO: Insert space between tags */}
      {(variableDefinition.subject_fields ?? []).slice(0, 4).map((subject_field) => (
        <Tag key={subject_field.code}>{subject_field.title}</Tag>
      ))}
    </Card>
  );
};

export { VardefSearchHit };
