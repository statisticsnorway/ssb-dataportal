import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ClassificationVariantResource } from '@/libs/data-access/klass';
import { buildUrl } from '../../utils/urls';
import VariantView from './VariantView';

vi.mock('@/components/details-list', () => ({
  DetailsList: ({ content }: { content: Array<{ label: string; value: React.ReactNode }> }) => (
    <dl>
      {content.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  ),
}));

vi.mock('./CodesView', () => ({
  CodesView: () => <div data-testid='codes-view' />,
}));

const baseVariant = {
  id: 42,
  name: 'Testvariant - variant av Test',
  owningSection: '320',
  classificationItems: [],
} as unknown as ClassificationVariantResource;

describe('VariantView', () => {
  it('renders a variant within its classification and version', () => {
    const backHref = buildUrl({ classificationId: 104, versionId: 10, tab: 'variants' });

    render(
      <VariantView
        variant={baseVariant}
        classificationId={104}
        versionId={10}
        backHref={backHref}
        fallbackLanguage='nb'
      />,
    );

    expect(screen.getByRole('link', { name: /Tilbake/ })).toHaveAttribute('href', backHref);
    expect(screen.getByRole('heading', { name: 'Test' })).toBeVisible();
    expect(screen.getByTestId('codes-view')).toBeVisible();
  });

  it('renders with the non-versioned back link when no versionId is given', () => {
    const backHref = buildUrl({ classificationId: 2003, tab: 'variants' });

    render(<VariantView variant={baseVariant} classificationId={2003} backHref={backHref} fallbackLanguage='nb' />);

    expect(screen.getByRole('link', { name: /Tilbake/ })).toHaveAttribute('href', backHref);
  });
});
