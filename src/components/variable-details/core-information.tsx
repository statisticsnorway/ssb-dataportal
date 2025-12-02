import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Section } from './layout-components';
import { TextField } from './text-field';

interface CoreInformationProps {
  data: CompleteResponse;
}

export const CoreInformation = ({ data }: CoreInformationProps) => {
  const { definition, comment } = data;

  return (
    <Section>
      <TextField label="Definisjon" value={definition.nb ?? ''} />

      {comment?.nb && (
        <TextField label="Kommentar" value={comment.nb} />
      )}
    </Section>
  );
};

