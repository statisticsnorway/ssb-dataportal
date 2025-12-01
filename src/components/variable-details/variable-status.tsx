import { Paragraph } from '@digdir/designsystemet-react';

interface VariableStatusFieldProps {
  status: string;
}

export const VariableStatusField = ({ status }: VariableStatusFieldProps) => {
  return (
    <div>
      <Paragraph data-size='md'>{status}</Paragraph>
    </div>
  );
};
