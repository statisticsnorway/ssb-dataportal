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
      <Paragraph>{variableDefinition.definition}</Paragraph>
      {variableDefinition.subject_fields?.map((subject_field) => (
        <Tag key={subject_field.code}>{subject_field.title}</Tag>
      ))}
    </Card>
  );
};

export { VardefSearchHit };
