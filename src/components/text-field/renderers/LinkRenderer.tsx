import { Link } from '@digdir/designsystemet-react';
import { Item } from '@/types/item';

//TODO(cbi): Check that we use recommended guidelines for links [https://github.com/statisticsnorway/metadata-catalog-prototype/issues/115]
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
