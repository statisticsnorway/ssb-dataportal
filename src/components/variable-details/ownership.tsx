import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { Section, InfoPanel } from './layout-components';

interface Props {
  data: CompleteResponse;
}

export const Ownership = ({ data }: Props) => {
  return (
    <Section title="Eier">
      <InfoPanel columns={2}>
        <Field label='Team' value={data.owner.team || '—'} />
        <Field label='Groups' value={data.owner.groups.join(', ') || '—'} />
        <Field label='Title' value={data.contact.title.nb || '—'} />
        <Field label='Email' value={data.contact.email || '—'} />
      </InfoPanel>
    </Section>
  );
};
