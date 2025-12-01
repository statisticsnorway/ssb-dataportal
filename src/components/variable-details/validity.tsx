import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { Section, InfoPanel } from './layout-components';

interface Props {
  data: CompleteResponse;
}

export const Validity = ({ data }: Props) => {
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return undefined;
    return new Date(date).toLocaleDateString('no-NB');
  };

  return (
    <Section title="Gyldighet">
      <InfoPanel columns={2}>
        <Field label='Gyldig fra' value={formatDate(data.validFrom) || '—'} />
        <Field label='Gyldig til' value={formatDate(data.validUntil) || '—'} />
        <Field label='Opprettet' value={formatDate(data.createdAt) || '—'} />
        <Field label='Opprettet av' value={data.createdBy || '—'} />
        <Field label='Sist oppdatert' value={formatDate(data.lastUpdatedAt) || '—'} />
        <Field label='Sist oppdatert av' value={data.lastUpdatedBy || '—'} />
      </InfoPanel>
    </Section>
  );
};
