import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { DetailsPagePanel } from './details-page-panel';

interface OwnershipProps {
  data: CompleteResponse;
}

export const Ownership = ({ data }: OwnershipProps) => {
  const { owner, contact } = data;

  return (
      <DetailsPagePanel title='Eier' elements={[
        { label: 'Team', value: owner.team || '—' },
        { label: 'Groups', value: owner.groups.join(', ') || '—' },
        { label: 'Title', value: contact.title.nb ?? '—' },
        { label: 'Email', value: contact.email || '—' },
      ]} columns={2}/>
  );
};
