import { Label, Link, Paragraph } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';
import styles from './text-field.module.css';

interface TextFieldProps extends Item {}

export const TextField = ({ label, value, href, longText,  }: TextFieldProps) => (
  <div className={styles.fieldWrapper}>
    <dt>{label}</dt>
    <dd>
      {href ? (
        <Link data-size="md" target="_blank" href={href}>
          {value}
        </Link>
      ) : longText ? (
        <Paragraph data-size="lg">{value}</Paragraph>
      ) : (
        <Label data-size="lg">{value}</Label>
      )}
    </dd>
  </div>
);
''