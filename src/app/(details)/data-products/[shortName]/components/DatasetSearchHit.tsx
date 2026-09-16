import { Badge, Tag, Tooltip } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { SearchHit } from '@/components/search-hit';
import { DatasetDTO } from '@/libs/data-access/datadoc/models';
import { localization } from '@/libs/language';
import { convertAssessment, convertDataSetState } from '@/utils/functions';
import styles from './components.module.css';

interface DatasetSearchHitProps {
  readonly dataset: DatasetDTO;
  readonly namingStandardViolationsCount: number;
}

export const DatasetSearchHit = ({ dataset, namingStandardViolationsCount }: DatasetSearchHitProps) => {
  const { isAuthenticated } = useAuthContext();

  const route = `${tabsData.DataProducts.route}/${dataset.product_short_name}/datasets/${dataset.id}`;
  const tagsList = (
    <>
      {dataset.dataset_state && <Tag data-color='success'>{convertDataSetState(dataset.dataset_state)}</Tag>}
      {dataset.assessment && <Tag data-color='warning'>{convertAssessment(dataset.assessment)}</Tag>}
      {isAuthenticated && dataset.owner && <Tag> {dataset.owner}</Tag>}
      {isAuthenticated && namingStandardViolationsCount > 0 && (
        <Tooltip content={localization.datasetDetail.namingStandardViolations}>
          <Badge
            count={namingStandardViolationsCount}
            data-color='warning'
            data-size='sm'
            className={styles.violationBadge}
            aria-label={`${namingStandardViolationsCount} total ${localization.datasetDetail.namingStandardViolations}`}
          />
        </Tooltip>
      )}
    </>
  );

  return <SearchHit href={route} title={dataset.short_description ?? dataset.id ?? ''} tagsList={tagsList} />;
};
