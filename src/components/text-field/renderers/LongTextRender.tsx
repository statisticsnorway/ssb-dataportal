import { Paragraph } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';

export default function LongTextRenderer({ value }: Item) {
  return <Paragraph>{value}</Paragraph>;
}
