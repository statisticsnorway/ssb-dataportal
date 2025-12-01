import { Heading } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import styles from './validity-and-status.module.css';

interface Props {
  data: CompleteResponse;
}

export const ValidityAndStatus = ({ data }: Props) => {
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return undefined;
    return new Date(date).toLocaleDateString('no-NB');
  };

  return (
    <section className={styles.fieldSection}>
      <Heading level={2} data-size='md'>
        Gyldighet
      </Heading>
      <section className={styles.gridTwoCol}>
        <Field label='Gyldig fra' value={formatDate(data.validFrom) || '—'} />
        <Field label='Gyldig til' value={formatDate(data.validUntil) || '—'} />
        <Field label='Opprettet' value={formatDate(data.createdAt) || '—'} />
        <Field label='Opprettet av' value={data.createdBy || '—'} />
        <Field label='Sist oppdatert' value={formatDate(data.lastUpdatedAt) || '—'} />
        <Field label='Sist oppdatert av' value={data.lastUpdatedBy || '—'} />
      </section>
    </section>
  );
};
