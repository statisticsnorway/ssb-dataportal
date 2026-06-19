import { Badge, Popover, Tag } from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { localization } from '@/libs/language';
import { type DataFileSearchHitData } from '@/types/dataFileSearchHit';
import styles from './components.module.css';

const monthYearFormat = { month: 'short', year: 'numeric', day: undefined } as Intl.DateTimeFormatOptions;

interface DataFileSearchHitProps {
  readonly dataFile: DataFileSearchHitData;
}

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

function formatPeriodString(dataFile: DataFileSearchHitData) {
  const fromDate = toDate(dataFile.contains_data_from ?? dataFile.start);
  const untilDate = toDate(dataFile.contains_data_until ?? dataFile.end);
  const from = fromDate?.toLocaleDateString(undefined, monthYearFormat);
  const until = untilDate?.toLocaleDateString(undefined, monthYearFormat);
  if (from === until) {
    return from;
  }
  return `${fromDate?.toLocaleDateString(undefined, monthYearFormat)} - ${untilDate?.toLocaleDateString(undefined, monthYearFormat)}`;
}

export const DataFileSearchHit = ({ dataFile }: DataFileSearchHitProps) => {
  return (
    <SearchHit
      key={dataFile.file_path}
      title={undefined}
      href={undefined}
      description={undefined}
      tagsList=<>
        <Tag data-color='warning'>{formatPeriodString(dataFile)}</Tag>
        <Tag>{dataFile.data_file_version ? `Versjon ${dataFile.data_file_version}` : 'Ikke versjonert'}</Tag>
        <Tag data-color='success'>{dataFile.file_type}</Tag>
        <CopyTag text={dataFile.file_path ?? 'undefined'} copyType='file_path' />
        {(dataFile.naming_standard_violations?.length ?? 0) > 0 ? (
          <Popover.TriggerContext>
            <Popover.Trigger
              inline
              className={styles.violationPopoverTrigger}
              aria-label={`${dataFile.naming_standard_violations?.length ?? 0} ${localization.datasetDetail.namingStandardViolations}`}
            >
              <Badge
                count={dataFile.naming_standard_violations?.length ?? 0}
                data-color='warning'
                data-size='sm'
                className={styles.violationBadge}
                aria-hidden
              />
            </Popover.Trigger>
            <Popover placement='top' id={`violations-${dataFile.file_path}`} className={styles.violationPopover}>
              <ul className={styles.violationsList}>
                {(dataFile.naming_standard_violations ?? []).map((violation) => (
                  <li key={violation}>{violation}</li>
                ))}
              </ul>
            </Popover>
          </Popover.TriggerContext>
        ) : null}
      </>
    />
  );
};
