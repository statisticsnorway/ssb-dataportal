import { describe, expect, it } from 'vitest';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { filterAndSortVariables } from './filterAndSort';

const variable = (name: string, shortName: string): RenderedView => ({
  id: shortName,
  patch_id: 1,
  name,
  short_name: shortName,
  unit_types: [],
  subject_fields: [],
  contains_special_categories_of_personal_data: false,
  variable_status: 'DRAFT',
  valid_from: new Date('2026-01-01'),
  owner: {
    team: 'test-team',
    groups: [],
  },
  created_at: new Date('2026-01-01'),
  created_by: 'test',
  last_updated_at: new Date('2026-01-01'),
  last_updated_by: 'test',
});

describe('filterAndSortVariables', () => {
  it('matches search terms against name and short name', () => {
    const variables = [
      variable('Antall baderom', 'sp17_rom'),
      variable('Bruksareal', 'bra'),
      variable('Aksje', 'aksje'),
    ];
    const result = filterAndSortVariables(variables, 'rom', [], [], 'titleAsc');
    expect(result.map((item) => item.name)).toEqual(['Antall baderom']);
  });

  it('sorts search hits by exact, starts with, then contains across name and short name', () => {
    const variables = [
      variable('Inneholder kode midt i navnet', 'annen'),
      variable('Kodeverk', 'starter-pa-kortnavn'),
      variable('Eksakt kortnavn', 'kode'),
      variable('Kode', 'eksakt-navn'),
      variable('Alfabetisk forstyrrer ikke relevans', 'prefix-kode-suffix'),
    ];
    const result = filterAndSortVariables(variables, 'kode', [], [], 'titleAsc');
    expect(result.map((item) => item.name)).toEqual([
      'Eksakt kortnavn',
      'Kode',
      'Kodeverk',
      'Alfabetisk forstyrrer ikke relevans',
      'Inneholder kode midt i navnet',
    ]);
  });
});
