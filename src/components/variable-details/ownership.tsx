import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Field } from './field';
import { DetailsPageSection, DetailsPagePanel } from './layout-components';



interface OwnershipProps {
  data: CompleteResponse;
}

export const Ownership = ({ data }: OwnershipProps) => {
  const { owner, contact } = data;

  return (
    <DetailsPageSection title="Eier">
      <DetailsPagePanel columns={2}>
        <Field label='Team' value={owner.team || '—'} />
        <Field label='Groups' value={owner.groups.join(', ') || '—'} />
        <Field label='Title' value={contact.title.nb || '—'} />
        <Field label='Email' value={contact.email || '—'} />
      </DetailsPagePanel>
    </DetailsPageSection>
  );
};
