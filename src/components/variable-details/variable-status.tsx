import { Heading, Paragraph } from '@digdir/designsystemet-react';
import styles from './field.module.css';

interface Props {
  status: string;
}

export const VariableStatusField = ({ status }: Props) => {
  return (
    <div>
      <Paragraph data-size='md'>{status}</Paragraph>
    </div>
  );
};
