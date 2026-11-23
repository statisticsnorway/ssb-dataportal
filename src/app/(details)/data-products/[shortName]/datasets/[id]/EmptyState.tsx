import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
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
    title: localization.datasetDetail.emptyState.noDataForPeriodTitle.replace('{period}', () => period),
    description: localization.datasetDetail.emptyState.noDataForPeriodDescription,
  }),
  'no-name-match': ({ query }) => ({
    title: localization.datasetDetail.emptyState.noNameMatchTitle.replace('{query}', () => query),
    description: localization.datasetDetail.emptyState.noNameMatchDescription,
  }),
  'invalid-name': ({ hint }) => ({
    title: localization.datasetDetail.emptyState.invalidNameTitle,
    description: hint,
  }),
  'no-match-for-combination': ({ filters }) => ({
    title: localization.datasetDetail.emptyState.noMatchForCombinationTitle.replace('{filters}', () =>
      filters.join(', '),
    ),
    description: localization.datasetDetail.emptyState.noMatchForCombinationDescription,
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
    <div className={styles.emptyState}>
      <output className='ds-sr-only'>{`${title}. ${description}`}</output>
      <Heading className={styles.title} level={3} data-size='sm'>
        {title}
      </Heading>
      <Paragraph className={styles.description}>{description}</Paragraph>
      {props.onReset ? (
        <Button type='button' className={styles.resetButton} variant='secondary' onClick={props.onReset}>
          {localization.datasetDetail.resetFilters}
        </Button>
      ) : null}
    </div>
  );
}
