import { Link } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';

export function LinkRenderer({ value, display }: Item) {
  if (!value) return null;

  if (Array.isArray(value)) {
    const displayArray = Array.isArray(display) ? display : value.map(() => display ?? 'Se lenke');

    return (
      <>
        {value.map((v, i) => (
          <Link key={i} href={v} style={{ display: 'block' }}>
            {displayArray[i]}
          </Link>
        ))}
      </>
    );
  }

  const text = display ?? value;
  return <Link href={value}>{text}</Link>;
}
