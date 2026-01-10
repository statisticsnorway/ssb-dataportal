import { Paragraph } from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

interface ClassificationSearchHitProps {
  classification: ClassificationResource;
}

const ClassificationSearchHit = ({ classification }: ClassificationSearchHitProps) => {
  return (
    <SearchHit
      key={classification.id}
      title={classification.name ?? 'Unnamed'}
      titleHref={`/classifications/${classification.id}`}
      content={
        <div>
          <section>
            <Paragraph>
              <span>{localization.id}</span> -<span>{classification.id}</span>
            </Paragraph>
            <Paragraph>
              <span>{classification.lastModified ? classification.lastModified.toLocaleString() : '-'}</span>
            </Paragraph>
          </section>
        </div>
      }
    />
  );
};

export { ClassificationSearchHit };
