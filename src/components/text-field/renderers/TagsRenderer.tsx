import { Tag } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';

export default function TagsRenderer({ value }: Item) {
  if (!Array.isArray(value)) return null;
  return (
    <>
      {value.map((v, i) => (
        <Tag key={i}>{v}</Tag>
      ))}
    </>
  );
}
