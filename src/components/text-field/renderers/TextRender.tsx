import { Item } from '@/types/item';

export function TextRenderer({ value }: Item) {
  return <p>{value}</p>;
}
