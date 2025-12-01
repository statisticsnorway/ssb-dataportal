import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from "./field";
import { Section } from './layout-components';

interface Props {
  data: CompleteResponse;
}

export const CoreInformation = ({ data }: Props) => {
  return (
    <Section>
      <Field label="Definisjon" value={data.definition.nb ?? ''} />
      <Field label="Kommentar" value={data.comment?.nb ?? ''} />
    </Section>
  );
};
