import { Badge, Popover, Tag } from '@digdir/designsystemet-react';
import { SearchHit } from '@/components/search-hit';
import { CopyTag } from '@/components/tag-components/copy-tag';
import { localization } from '@/libs/language';
import { type DataFileSearchHitData } from '@/types/dataFileSearchHit';
import { formatPeriodString } from '../utils/dates';
import styles from './components.module.css';

interface DataFileSearchHitProps {
  readonly dataFile: DataFileSearchHitData;
}

export const DataFileSearchHit = ({ dataFile }: DataFileSearchHitProps) => {
  const violations = dataFile.naming_standard_violations ?? [];

  return (
    <SearchHit
      tagsList=<>
        <Tag data-color='magic'>{formatPeriodString(dataFile)}</Tag>
        <Tag data-color='magic'>
          {dataFile.data_file_version != null
            ? localization.dataCoverageTimeline.fileVersion.replace('{version}', String(dataFile.data_file_version))
            : localization.dataCoverageTimeline.unversioned}
        </Tag>
        <Tag data-color='magic'>{dataFile.file_type}</Tag>
        <CopyTag text={dataFile.file_path ?? 'undefined'} copyType='file_path' />
        {violations.length > 0 ? (
          <Popover.TriggerContext>
            <Popover.Trigger
              inline
              className={styles.violationPopoverTrigger}
              aria-label={`${violations.length} ${localization.datasetDetail.namingStandardViolations}`}
            >
              <Badge
                count={violations.length}
                data-color='warning'
                data-size='sm'
                className={styles.violationBadge}
                aria-hidden
              />
            </Popover.Trigger>
            <Popover placement='top' className={styles.violationPopover}>
              <ul className={styles.violationsList}>
                {violations.map((violation) => (
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
