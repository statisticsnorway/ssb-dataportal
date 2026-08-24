import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { DetailsList } from '@/components/details-list';
import { CorrespondenceTableResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { mapCorrespondenceDetails } from '../../utils/correspondences';
import { CorrespondenceTable } from '../correspondence-table';
import styles from './views.module.css';

interface CorrespondenceDetailViewProps {
  table: CorrespondenceTableResource;
  backHref: string;
  downloadHref: string;
}

export default function CorrespondenceDetailView({
  table,
  backHref,
  downloadHref,
}: Readonly<CorrespondenceDetailViewProps>) {
  return (
    <section className={styles.aboutWrapper} aria-labelledby='correspondence-title'>
      <DigdirLink asChild>
        <Link href={backHref}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <Heading id='correspondence-title' className='secondaryHeading' data-size='md' level={3}>
        {table.name}
      </Heading>
      <DetailsList content={mapCorrespondenceDetails(table)} />
      <Heading className='secondaryHeading' data-size='sm' level={4}>
        {localization.classificationDetails.codes}
      </Heading>
      <CorrespondenceTable
        sourceName={table.source ?? ''}
        targetName={table.target ?? ''}
        mappings={table.correspondenceMaps ?? []}
        downloadHref={downloadHref}
      />
    </section>
  );
}
