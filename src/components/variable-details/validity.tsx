import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { DetailsPagePanel, DetailsPageSection } from './layout-components';

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
    <DetailsPageSection title='Gyldighet'>
      <DetailsPagePanel columns={2}>
        <Field label='Gyldig fra' value={formatDate(validFrom) || '—'} />
        <Field label='Gyldig til' value={formatDate(validUntil) || '—'} />
        <Field label='Opprettet' value={formatDate(createdAt) || '—'} />
        <Field label='Opprettet av' value={createdBy || '—'} />
        <Field label='Sist oppdatert' value={formatDate(lastUpdatedAt) || '—'} />
        <Field label='Sist oppdatert av' value={lastUpdatedBy || '—'} />
      </DetailsPagePanel>
    </DetailsPageSection>
  );
};
