import { Item } from '@/types/item';
import { Paragraph } from '@digdir/designsystemet-react';

export default function LongTextRenderer({ value }: Item) {
  return <Paragraph>{value}</Paragraph>;
}
