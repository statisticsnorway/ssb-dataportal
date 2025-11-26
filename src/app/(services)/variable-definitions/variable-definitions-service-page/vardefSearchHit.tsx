import {Card, Heading, Paragraph} from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { localization } from '@/libs/language';
import { VariableDefinitionType } from '@/types/variableDefinition';

interface VardefSearchHitProps {
  variableDefinition: VariableDefinitionType;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
        <Card>
            <Heading data-size="2xl" level={2}>
                {variableDefinition.name} - {variableDefinition.short_name}
            </Heading>
            <Paragraph>{variableDefinition.definition}</Paragraph>
        </Card>
  );
};

export { VardefSearchHit };
