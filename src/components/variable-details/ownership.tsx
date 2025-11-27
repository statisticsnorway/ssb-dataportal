import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Heading } from "@digdir/designsystemet-react";
import { Field } from "./field";
import styles from './ownership.module.css';

interface Props {
  data: CompleteResponse;
}

export const Ownership = ({ data }: Props) => {
  return (
    <section className={styles.fieldSection}>
      <Heading level={2} data-size="md">
        Eier
      </Heading>
      <div className={styles.gridTwoCol}>
        <Field label="Team" value={data.owner.team || '—'} />
        <Field label="Groups" value={data.owner.groups.join(', ') || '—'} />
      </div>
      <Heading level={2} data-size="md">
        Kontakt
      </Heading>
      <div className={styles.gridTwoCol}>
        <Field label="Title" value={data.contact.title.nb || '—'} />
        <Field label="Email" value={data.contact.email || '—'} />
      </div>
    </section>
  );
};
