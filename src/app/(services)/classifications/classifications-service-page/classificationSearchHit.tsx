import { Card, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

interface SearchHitProps {
  classification?: ClassificationResource;
}

const ClassificationSearchHit = ({ classification }: SearchHitProps) => {
  return (
    <Card>
      <Heading className='secondaryHeading' level={2} data-size='sm'>
        <Link href={`/classifications/${classification?.id}`}>{classification?.name}</Link>
      </Heading>
      <section>
        <Paragraph>
          <span>{localization.id}</span> -<span>{classification?.id}</span>
        </Paragraph>
        <Paragraph>
          <span>{classification?.lastModified ? classification.lastModified.toLocaleString() : '-'}</span>
        </Paragraph>
      </section>
    </Card>
  );
};

export { ClassificationSearchHit };
