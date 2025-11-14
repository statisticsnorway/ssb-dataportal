import { SearchHit } from '@/components/search-hit';
import { Classification } from '@/types/classification';
import { Paragraph } from '@digdir/designsystemet-react';
import styles from '../../services.module.css';
import { localization } from '@/utils/src';

interface ClassificationSearchHitProps {
  classification: Classification;
}

const ClassificationSearchHit = ({ classification }: ClassificationSearchHitProps) => {
  return (
    <SearchHit
      key={classification.id}
      title={classification.name}
      titleHref={`/classifications/${classification.id}`}
      content={
        <div className={styles.set}>
          <section className={styles.idSection}>
            <Paragraph>
              <span className={styles.info}>{localization.id}</span> -<span>{classification.id}</span>
            </Paragraph>
            <Paragraph>
              <span className={styles.info}>{localization.lastModified}</span> -
              <span>{classification.lastModified}</span>
            </Paragraph>
          </section>
        </div>
      }
    />
  );
};

export { ClassificationSearchHit };
