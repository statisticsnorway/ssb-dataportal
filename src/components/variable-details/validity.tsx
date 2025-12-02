import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { DetailsPagePanel } from './details-page-panel';


interface ValidityProps {
  data: CompleteResponse;
}

const formatDate = (date: Date | string | undefined | null) => {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('no-NB');
};

export const Validity = ({ data }: ValidityProps) => {
  const { validFrom, validUntil, createdAt, createdBy, lastUpdatedAt, lastUpdatedBy } = data;

  return (
    <DetailsPagePanel title='Gyldighet' columns={2} elements={[
      { label: 'Gyldig fra', value: formatDate(validFrom) || '—' },
      { label: 'Gyldig til', value: formatDate(validUntil) || '—' },
      { label: 'Opprettet', value: formatDate(createdAt) || '—' },
      { label: 'Opprettet av', value: createdBy || '—' },
      { label: 'Sist oppdatert', value: formatDate(lastUpdatedAt) || '—' },
      { label: 'Sist oppdatert av', value: lastUpdatedBy || '—' },
    ]} />
  );
};
