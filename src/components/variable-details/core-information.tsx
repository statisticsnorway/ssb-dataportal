import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from "./field";
import { Section } from './layout-components';

interface CoreInformationProps {
  data: CompleteResponse;
}

export const CoreInformation = ({ data }: CoreInformationProps) => {
  const { definition, comment } = data;

  return (
    <Section>
      <Field label="Definisjon" value={definition.nb ?? ''} />
      <Field label="Kommentar" value={comment?.nb ?? ''} />
    </Section>
  );
};
