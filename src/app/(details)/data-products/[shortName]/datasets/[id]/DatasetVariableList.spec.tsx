import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import DatasetVariableList from './DatasetVariableList';

describe('DatasetVariableList status announcements', () => {
  it('announces settled result counts, including no results, from a persistent status', () => {
    const variables = [{ id: 'one', short_name: 'person', physical_type: 'INT32' }] as DatasetVariableDTO[];
    const { rerender } = render(<DatasetVariableList variables={variables} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(localization.datasetDetail.variablesFound.replace('{count}', '1'));
    rerender(<DatasetVariableList variables={variables} isLoading />);
    expect(status).toBeEmptyDOMElement();
    rerender(<DatasetVariableList variables={[]} />);
    expect(status).toHaveTextContent(localization.datasetDetail.variablesFound.replace('{count}', '0'));
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});
