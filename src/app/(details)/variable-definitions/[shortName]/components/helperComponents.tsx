import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { ExternalLink } from '@/components/external-link';

export const Mailto = ({ email }: { email: string }) => {
  return (
    <div>
      <EnvelopeClosedIcon style={{ marginRight: '0.5rem', fontSize: '1.5rem' }} />
      <ExternalLink href={`mailto:${email}`} linkText={email} />
    </div>
  );
};
