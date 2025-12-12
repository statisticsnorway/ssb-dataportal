import { Item } from '@/types/item';

export default function TextRenderer({ value }: Item) {
  return <p>{value}</p>;
}
