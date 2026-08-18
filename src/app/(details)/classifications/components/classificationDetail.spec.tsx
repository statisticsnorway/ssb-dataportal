import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import classificationMock from '@/static-data/classifications.json';
import { buildUrl } from '../utils/urls';
import ClassificationDetail from './classificationDetail';

vi.mock('server-only', () => ({}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => buildUrl({ classificationId: 2003 }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

vi.mock('@/app/(details)/classifications/components/classification-table', () => ({
  ClassificationTable: ({ content }: { content: unknown[] }) => (
    <div data-testid='classification-table'>rows: {content.length}</div>
  ),
}));

vi.mock('./views/VersionView', () => ({
  VersionView: ({ children }: { children: React.ReactNode }) => <div data-testid='version-view'>{children}</div>,
}));

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

describe('Classification details page', () => {
  it('renders ClassificationVersionTable with mapped versions', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    expect(screen.getByTestId('classification-table')).toBeDefined();
  });

  it('passes correct number of rows to ClassificationVersionTable', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    const expected = classification.versions?.length ?? 0;
    expect(screen.getByTestId('classification-table').textContent).toBe(`rows: ${expected}`);
  });

  it('renders the classification name as the primary heading', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(classification.name);
  });

  it('renders the classification description when provided', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    if (classification.description) {
      expect(screen.getByText(classification.description)).toBeDefined();
    }
  });

  it('does not render a description paragraph when description is missing', () => {
    const withoutDescription = { ...classification, description: undefined } as ClassificationResource;
    render(
      <ClassificationDetail classification={withoutDescription} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    expect(screen.queryByText(classification.description ?? '')).toBeNull();
  });

  it('renders breadcrumbs with a link to the classifications listing', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    const link = screen.getByRole('link', { name: localization.classification.labelPlural });
    expect(link.getAttribute('href')).toBe(buildUrl({}));
  });

  it('renders the "all versions" expandable section title', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    expect(screen.getByText(localization.classificationDetails.versions)).toBeDefined();
  });

  it('renders children inside the VersionView', () => {
    render(
      <ClassificationDetail classification={classification} classificationVersion={null}>
        <div data-testid='child-content'>child</div>
      </ClassificationDetail>,
    );
    const versionView = screen.getByTestId('version-view');
    expect(versionView.querySelector('[data-testid="child-content"]')).not.toBeNull();
  });

  it('falls back to classification id in breadcrumb when name is missing', () => {
    const withoutName = { ...classification, name: undefined } as ClassificationResource;
    render(
      <ClassificationDetail classification={withoutName} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    expect(screen.getAllByText(String(classification.id)).length).toBeGreaterThan(0);
  });

  it('renders an empty version table when classification has no versions', () => {
    const withoutVersions = { ...classification, versions: [] } as unknown as ClassificationResource;
    render(
      <ClassificationDetail classification={withoutVersions} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );
    expect(screen.getByTestId('classification-table').textContent).toBe('rows: 0');
  });
  it('renders correct html lang when fallback language is used', () => {
    const withFallback = {
      ...classification,
      fallbackLanguage: 'en',
    } as unknown as ClassificationResource;

    render(
      <ClassificationDetail classification={withFallback} classificationVersion={null}>
        {null}
      </ClassificationDetail>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.getAttribute('lang')).toBe('en');

    if (withFallback.description) {
      const paragraph = screen.getByText(withFallback.description);
      expect(paragraph.getAttribute('lang')).toBe('en');
    }
  });
});
