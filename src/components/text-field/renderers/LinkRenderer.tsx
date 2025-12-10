import { Item } from '@/types/item';
import { Link } from '@digdir/designsystemet-react';

export default function LinkRenderer({ value, display }: Item) {
  if (!value) return null;

  console.log(value, display);

  if (Array.isArray(value)) {
    const displayArray = Array.isArray(display)
      ? display
      : value.map(() => display ?? 'Se lenke');

    return (
      <>
        {value.map((v, i) => (
          <Link
            key={i}
            href={v}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            {displayArray[i]}
          </Link>
        ))}
      </>
    );
  }

  const text = display ?? value;
  return (
    <Link href={value} target="_blank" rel="noopener noreferrer">
      {text}
    </Link>
  );
}
