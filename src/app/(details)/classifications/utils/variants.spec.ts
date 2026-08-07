import { describe, expect, it } from 'vitest';
import { formatVariantName } from './variants';

describe('format variant name', () => {
  it('Removes generic variant suffix', () => {
    const variantName = 'Næringsgruppering 2002 - variant av Næringsgruppering (SN) 2002';
    const formattedName = formatVariantName(variantName);
    expect(formattedName).toBe('Næringsgruppering 2002');
  });
});
