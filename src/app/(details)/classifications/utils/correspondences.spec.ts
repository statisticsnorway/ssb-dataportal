import { describe, expect, it } from 'vitest';
import {
  mapCorrespondenceDetails,
  mapCorrespondenceItems,
} from '@/app/(details)/classifications/utils/correspondences';
import { localization } from '@/libs/language';

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
      { label: 'Fra', value: 'SN2007' },
      { label: 'Nivå', value: 'Nivå 1' },
      { label: 'Til', value: 'SN2015' },
      { label: 'Nivå', value: 'Nivå 2' },
      { label: 'Eier', value: '320' },
    ]);
  });

  it('maps correspondence details', () => {
    const table = {
      id: 1506,
      owningSection: '320',
      contactPerson: { name: 'Dana Moe' },
      description: 'Viser sammenhengen mellom kodeverkene.',
    };

    expect(mapCorrespondenceDetails(table)).toEqual([
      { label: 'ID', value: 1506 },
      { label: 'Eierseksjon', value: '320' },
      { label: 'Ansvarlig', value: 'Dana Moe' },
    ]);
  });

  it('uses the common fallback for missing correspondence details', () => {
    expect(mapCorrespondenceDetails({})).toEqual([
      { label: 'ID', value: localization.noDataPlaceholder },
      { label: 'Eierseksjon', value: localization.noDataPlaceholder },
      { label: 'Ansvarlig', value: localization.noDataPlaceholder },
    ]);
  });
});
