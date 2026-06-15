import { Card, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

interface SearchHitProps {
  classification?: ClassificationResource;
}

const formatLastModified = (date?: Date) => {
  if (!date) return '-';

  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date);
};

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
          <span>{formatLastModified(classification?.lastModified)}</span>
        </Paragraph>
      </section>
    </Card>
  );
};

export { ClassificationSearchHit };
