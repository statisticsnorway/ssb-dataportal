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
      { isLocalized: false, label: 'Korrespondanser fra', value: 'SN2007' },
      { isLocalized: false, label: 'Nivå', value: 'Nivå 1' },
      { isLocalized: false, label: 'Korrespondanser til', value: 'SN2015' },
      { isLocalized: false, label: 'Nivå', value: 'Nivå 2' },
      { isLocalized: false, label: 'Eier', value: '320' },
    ]);
  });
});
