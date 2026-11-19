import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import DatasetVariableList from './DatasetVariableList';
import type { EmptyStateProps } from './EmptyState';

const emptyState: EmptyStateProps = { reason: 'no-name-match', query: 'person' };

describe('DatasetVariableList status announcements', () => {
  it('announces settled result counts, including no results, from a persistent status', () => {
    const variables = [{ id: 'one', short_name: 'person', physical_type: 'INT32' }] as DatasetVariableDTO[];
    const { rerender } = render(<DatasetVariableList variables={variables} emptyState={emptyState} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(localization.datasetDetail.variablesFound.replace('{count}', '1'));
    rerender(<DatasetVariableList variables={variables} isLoading emptyState={emptyState} />);
    expect(status).toBeEmptyDOMElement();
    rerender(<DatasetVariableList variables={[]} emptyState={emptyState} />);
    expect(status).toHaveTextContent(localization.datasetDetail.variablesFound.replace('{count}', '0'));
    expect(screen.getByRole('heading', { name: 'Ingen variabler matcher «person»' })).toBeInTheDocument();
  });
});
