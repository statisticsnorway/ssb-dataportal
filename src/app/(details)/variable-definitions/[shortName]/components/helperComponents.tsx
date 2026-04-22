import { Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { ExternalLink } from '@/components/external-link';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language/src/localization';
import styles from './code-snippet.module.css';

export const Mailto = ({ email }: { email: string }) => {
  return (
    <div className={styles.mail}>
      <EnvelopeClosedIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }} />
      <ExternalLink href={`mailto:${email}`} linkText={email} />
    </div>
  );
};

export const Owner = ({ variable }: { variable: RenderedView }) => {
  const fields = [
    {
      label: localization.owner.daplaTeam.toUpperCase(),
      value: variable?.owner?.team,
    },
    {
      label: localization.owner.groups.toUpperCase(),
      value: variable?.owner?.groups.join(','),
    },
  ];
  return (
    <div className={styles.owner}>
      {fields.map((field) => (
        <Paragraph key={field.label}>
          <span>{field.label}</span>
          <span>:</span>
          <span>{field.value}</span>
        </Paragraph>
      ))}
    </div>
  );
};
