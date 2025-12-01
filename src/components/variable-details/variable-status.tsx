import { Heading, Paragraph } from '@digdir/designsystemet-react';

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
