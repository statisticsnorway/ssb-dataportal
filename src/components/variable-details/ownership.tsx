import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { FieldSection } from './field-section';

interface Props {
  data: CompleteResponse;
}

export const Ownership = ({ data }: Props) => {
  return (
    <FieldSection title="Eier">
      <Field label='Team' value={data.owner.team || '—'} />
      <Field label='Groups' value={data.owner.groups.join(', ') || '—'} />
      <Field label='Title' value={data.contact.title.nb || '—'} />
      <Field label='Email' value={data.contact.email || '—'} />
    </FieldSection>
  );
};
