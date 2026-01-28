import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

interface SearchHitProps {
  classification?: ClassificationResource;
}

const ClassificationSearchHit = ({ classification }: SearchHitProps) => {
  return (
    <Card>
      <Heading level={2} data-size='sm'>
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
