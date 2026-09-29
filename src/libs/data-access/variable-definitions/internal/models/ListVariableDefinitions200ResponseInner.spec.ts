import { describe, expect, it } from 'vitest';
import { ListVariableDefinitions200ResponseInnerFromJSONTyped } from './ListVariableDefinitions200ResponseInner';

describe('ListVariableDefinitions200ResponseInnerFromJSONTyped', () => {
  it('decodes rendered responses as RenderedView when name and definition are strings', () => {
    const parsed = ListVariableDefinitions200ResponseInnerFromJSONTyped(
      {
        id: '9kT80ke2',
        patch_id: 1,
        name: 'Antall levende fodte',
        short_name: 'ant_lev_fodt',
        definition: 'Antall barn fodt levende',
        unit_types: [{ code: 'PERSON', title: 'Person' }],
        subject_fields: [{ code: '03', title: 'Befolkning' }],
        contains_special_categories_of_personal_data: false,
        variable_status: 'DRAFT',
        valid_from: '1900-01-01',
        owner: { team: 'team-a', groups: ['group-a'] },
        contact: { title: 'Kontaktperson', email: 'person@example.no' },
        created_at: '2024-01-01T00:00:00.000Z',
        created_by: 'user-a',
        last_updated_at: '2024-01-02T00:00:00.000Z',
        last_updated_by: 'user-b',
      },
      false,
    );

    expect(parsed.name).toBe('Antall levende fodte');
    expect(parsed.definition).toBe('Antall barn fodt levende');
  });
});
