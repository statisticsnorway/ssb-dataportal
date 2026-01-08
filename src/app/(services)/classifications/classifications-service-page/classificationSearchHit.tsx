import { Paragraph } from '@digdir/designsystemet-react';
import { SearchHit } from '@/app/(services)/classifications/components/search-hit';
import { localization } from '@/libs/language';
import { Classification } from '@/types/classification';

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
        <div>
          <section>
            <Paragraph>
              <span>{localization.id}</span> -<span>{classification.id}</span>
            </Paragraph>
            <Paragraph>
              <span>{localization.lastModified}</span> -<span>{classification.lastModified}</span>
            </Paragraph>
          </section>
        </div>
      }
    />
  );
};

export { ClassificationSearchHit };
