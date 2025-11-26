import { Paragraph } from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { RenderedVariableDefinition } from '@/libs/data-access/variable-definitions/public/models/RenderedVariableDefinition';
import { localization } from '@/libs/language';

interface VardefSearchHitProps {
  variableDefinition: RenderedVariableDefinition;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <SearchHit
      key={variableDefinition.id}
      title={variableDefinition.name ?? ''}
      titleHref={`/variable-definitions/${variableDefinition.id}`}
      content={
        <div>
          <section>
            <Paragraph>
              <span>{localization.id}</span> -<span>{variableDefinition.id}</span>
            </Paragraph>
            <Paragraph>
              <span>{localization.lastModified}</span> -
              <span>{variableDefinition.lastUpdatedAt?.toISOString().split('T')[0]}</span>
            </Paragraph>
          </section>
          <Paragraph>{variableDefinition.definition}</Paragraph>
        </div>
      }
    />
  );
};

export { VardefSearchHit };
