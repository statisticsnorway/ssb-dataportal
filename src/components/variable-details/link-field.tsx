import { Heading, Paragraph } from "@digdir/designsystemet-react";
import styles from "./field.module.css";

interface Props {
  label: string;
  value: string;
}

export const LinkField = ({ label, value }: Props) => {
  return (
    <div className={styles['info-block-container']}>
      <div className={styles['info-block-item']}>
        <Heading level={3} data-size="xl" className={styles.label}>
          {label}
        </Heading>
        <Paragraph data-size="md">
          <a target="_blank" rel="noopener noreferrer" href={value}>Lenke</a>
        </Paragraph>
      </div>
    </div>
  );
}