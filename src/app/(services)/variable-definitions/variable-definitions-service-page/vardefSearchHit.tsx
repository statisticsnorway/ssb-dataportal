import {Card, Heading, Paragraph, Tag} from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { localization } from '@/libs/language';
import { VariableDefinitionType } from '@/types/variableDefinition';
import Link from "next/link";

interface VardefSearchHitProps {
  variableDefinition: VariableDefinitionType;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
        <Card>
                <Link
                    href="https://hmpg.net/"
                    rel="noopener noreferrer"
                >
                    <Heading data-size="xl" level={1}>
                        {variableDefinition.name} - {variableDefinition.short_name}
                    </Heading>
                </Link>
            <Paragraph>{variableDefinition.definition}</Paragraph>
            <Tag variant="default">
                Statistikk
            </Tag>
        </Card>
  );
};

export { VardefSearchHit };
