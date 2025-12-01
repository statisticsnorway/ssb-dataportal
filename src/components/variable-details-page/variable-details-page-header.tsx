
import { Heading, Tag } from '@digdir/designsystemet-react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import styles from './variable-details-page-layout.module.css';


export const DetailsPageHeader = ({ variableDefinition }: { variableDefinition: CompleteResponse }) => {
  const { name, shortName, id, variableStatus } = variableDefinition;

  return (
    <header className={styles.detailsPageHeader}>
      <div className={styles.headerInfo}>
        <Heading level={1} data-size="xl">
          {name.nb}
        </Heading>
        <div className={styles.headerInfoText}>
          <span>{shortName}</span>
          <div className={styles.separator} />
          <span>ID: {id}</span>
        </div>
      </div>
      <Tag data-size="md" data-color="info">
        {variableStatus}
      </Tag>
    </header>
  );
};