import { describe, expect, it } from 'vitest';
import { mapCorrespondenceItems } from '@/app/(details)/classifications/utils/correspondences';

describe('correspondence', () => {
  it('maps correspondance items', () => {
    const table = {
      source: 'SN2007',
      sourceLevel: { levelName: 'Nivå 1' },
      target: 'SN2015',
      targetLevel: { levelName: 'Nivå 2' },
      owningSection: '320',
    };
    expect(mapCorrespondenceItems(table)).toEqual([
      { label: 'Korrespondanser fra', value: 'SN2007' },
      { label: 'Nivå', value: 'Nivå 1' },
      { label: 'Korrespondanser til', value: 'SN2015' },
      { label: 'Nivå', value: 'Nivå 2' },
      { label: 'Eier', value: '320' },
    ]);
  });
});
