import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { buildUrl } from '../../utils/urls';
import VariantsView from './VariantsView';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchClassificationById: vi.fn().mockResolvedValue({ fallbackLanguage: 'nb' }),
}));

const version = {
  id: 10,
  classificationVariants: [{ id: 42, name: 'Testvariant - variant av Test', owningSection: '320' }],
} as ClassificationVersionResource;

describe('VariantsView', () => {
  it('links variants without a version when none is selected explicitly', () => {
    render(<VariantsView classificationVersion={version} classificationId={104} />);

    expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute(
      'href',
      `${buildUrl({ classificationId: 104, tab: 'variants' })}/42`,
    );
    expect(screen.getByText('320')).toBeVisible();
  });

  it('keeps an explicitly selected version in the variant link', () => {
    render(<VariantsView classificationVersion={version} classificationId={104} versionId={10} />);

    expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute(
      'href',
      `${buildUrl({ classificationId: 104, versionId: 10, tab: 'variants' })}/42`,
    );
  });

  it('shows an informational alert when the version has no variants', () => {
    render(<VariantsView classificationVersion={{ classificationVariants: [] }} classificationId={104} />);

    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.variant.noVariants);
  });
});
