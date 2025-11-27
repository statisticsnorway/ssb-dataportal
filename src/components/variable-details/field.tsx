import { Heading, Paragraph } from '@digdir/designsystemet-react';
import styles from './field.module.css';

interface Props {
  label: string;
  value: string;
}

export const Field = ({ label, value }: Props) => {
  return (
    <div className={styles['info-block-container']}>
      <div className={styles['info-block-item']}>
        <Heading level={3} data-size='xl' className={styles.label}>
          {label}
        </Heading>
        <Paragraph data-size='md'>{value}</Paragraph>
      </div>
    </div>
  );
};
