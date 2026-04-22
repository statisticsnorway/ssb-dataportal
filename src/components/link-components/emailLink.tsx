import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { ExternalLink } from './externalLink';
import styles from './links.module.css';

export const EmailLink = ({ email }: { email: string }) => {
  return (
    <div className={styles.mail}>
      <EnvelopeClosedIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }} />
      <ExternalLink href={`mailto:${email}`} linkText={email} />
    </div>
  );
};
