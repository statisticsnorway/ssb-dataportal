import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Heading, Paragraph } from "@digdir/designsystemet-react";
import { Field } from "./field";
import styles from './core-information.module.css';

interface Props {
  data: CompleteResponse;
}

export const CoreInformation = ({ data }: Props) => {
  return (
    <section className={styles.fieldSection}>
      <Field label="Definition" value={data.definition.nb ?? ''} />
      <Field label="Kommentar" value={data.comment?.nb ?? ''} />
    </section>
  );
};
