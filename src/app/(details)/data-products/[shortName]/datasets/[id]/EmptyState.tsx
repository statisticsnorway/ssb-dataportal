import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import styles from './EmptyState.module.css';

type EmptyStateVariant =
  | Readonly<{ reason: 'no-data-for-period'; period: string }>
  | Readonly<{ reason: 'no-name-match'; query: string }>
  | Readonly<{ reason: 'invalid-name'; query: string; hint: string }>
  | Readonly<{ reason: 'no-match-for-combination'; filters: readonly string[] }>;

export type EmptyStateProps = EmptyStateVariant & { onReset?: () => void };

type EmptyStateCopy = Readonly<{ title: string; description: string }>;
type EmptyStateCopyLookup = {
  [Reason in EmptyStateProps['reason']]: (props: Extract<EmptyStateProps, { reason: Reason }>) => EmptyStateCopy;
};

const copyByReason: EmptyStateCopyLookup = {
  'no-data-for-period': ({ period }) => ({
    title: `Ingen variabler for ${period}`,
    description: 'Det finnes ingen fil med data for denne perioden.',
  }),
  'no-name-match': ({ query }) => ({
    title: `Ingen variabler matcher «${query}»`,
    description: 'Sjekk stavemåten eller prøv et kortere søk.',
  }),
  'invalid-name': ({ hint }) => ({
    title: 'Ugyldig søk',
    description: hint,
  }),
  'no-match-for-combination': ({ filters }) => ({
    title: `Ingen variabler for ${filters.join(', ')}`,
    description: 'Prøv et annet filter, eller fjern filteret for å se alle variabler.',
  }),
};

function getCopy<Reason extends EmptyStateProps['reason']>(
  reason: Reason,
  props: Extract<EmptyStateProps, { reason: Reason }>,
) {
  return copyByReason[reason](props);
}

export function EmptyState(props: EmptyStateProps) {
  const { title, description } = getCopy(props.reason, props);

  return (
    <div className={styles.emptyState} role='status'>
      <Heading className={styles.title} level={3} data-size='sm'>
        {title}
      </Heading>
      <Paragraph className={styles.description}>{description}</Paragraph>
      {props.onReset ? (
        <Button type='button' className={styles.resetButton} variant='secondary' onClick={props.onReset}>
          Nullstill filter
        </Button>
      ) : null}
    </div>
  );
}
