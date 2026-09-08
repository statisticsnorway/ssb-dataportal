import { Card, Details, DetailsSummary, Paragraph, Tag, Tooltip } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { localization } from '@/libs/language';
import { formatLanguages } from '@/utils/functions';
import styles from './expandableTable.module.css';

interface ExpandableTableProps {
  table?: React.ReactNode;
  message?: string;
  title?: string;
}
const ExpandableTable = ({ table, title, message }: ExpandableTableProps) => {
  const languageTag = (
    <Tooltip content={localization.classification.language.notSelectedLanguage}>
      <Tag data-size='lg' tabIndex={0}>
        <GlobeIcon aria-hidden='true' focusable='false' />
        {formatLanguages('nb')}
      </Tag>
    </Tooltip>
  );
  return (
    <Card className={styles.card}>
      <Details className={styles.details}>
        {title && <DetailsSummary>{title} {languageTag}</DetailsSummary>}
        {table && <span className={styles.table}>{table}</span>}
        {message && <Paragraph lang='no'>{message}</Paragraph>}
      </Details>
    </Card>
  );
};

export { ExpandableTable };
