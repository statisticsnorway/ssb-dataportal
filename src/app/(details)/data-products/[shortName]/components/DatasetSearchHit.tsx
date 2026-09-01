import { Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { SearchHit } from '@/components/search-hit';
import { DatasetDTO } from '@/libs/data-access/datadoc/models';
import { convertAssessment, convertDataSetState } from '@/utils/functions';

interface DatasetSearchHitProps {
  readonly dataset: DatasetDTO;
}

export const DatasetSearchHit = ({ dataset }: DatasetSearchHitProps) => {
  const { isAuthenticated } = useAuthContext();

  const route = `${tabsData.DataProducts.route}/${dataset.product_short_name}/datasets/${dataset.id}`;
  const tagsList = (
    <>
      {dataset.dataset_state && <Tag data-color='success'>{convertDataSetState(dataset.dataset_state)}</Tag>}
      {dataset.assessment && <Tag data-color='warning'>{convertAssessment(dataset.assessment)}</Tag>}
      {isAuthenticated && dataset.owner && <Tag> {dataset.owner}</Tag>}
    </>
  );

  return <SearchHit href={route} title={dataset.short_description ?? dataset.id ?? ''} tagsList={tagsList} />;
};
