import { Paragraph } from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { localization } from '@/libs/language';
import { VariableDefinitionType } from '@/types/variableDefinition';
import styles from '../../services.module.css';

interface VardefSearchHitProps {
  variableDefinition: VariableDefinitionType;
}

const VardefSearchHit = ({ variableDefinition }: VardefSearchHitProps) => {
  return (
    <SearchHit
      key={variableDefinition.id}
      title={variableDefinition.name}
      titleHref={`/variable-definitions/${variableDefinition.id}`}
      content={
        <div className={styles.set}>
          <section className={styles.idSection}>
            <Paragraph>
              <span className={styles.info}>{localization.id}</span> -<span>{variableDefinition.id}</span>
            </Paragraph>
            <Paragraph>
              <span className={styles.info}>{localization.lastModified}</span> -
              <span>{variableDefinition.last_updated_at}</span>
            </Paragraph>
          </section>
          <Paragraph>{variableDefinition.definition}</Paragraph>
        </div>
      }
    />
  );
};

export { VardefSearchHit };
