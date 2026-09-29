import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { localization } from '@/libs/language';
import SearchLayout from './layout';

const mocks = vi.hoisted(() => ({
  pathname: '/variable-definitions',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

const renderLayout = () =>
  render(
    <SearchLayout>
      <div data-testid='tab-content' />
    </SearchLayout>,
  );

describe('services layout', () => {
  beforeEach(() => {
    mocks.pathname = '/variable-definitions';
  });

  it('renders the tab list and the injected tab content', () => {
    renderLayout();

    expect(screen.getByRole('tab', { name: localization.tabs.variableDefinitions })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: localization.tabs.classifications })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: localization.tabs.dataProducts })).toBeInTheDocument();
    expect(screen.getByTestId('tab-content')).toBeInTheDocument();
  });

  it('marks the tab matching the current route as selected', () => {
    mocks.pathname = '/data-products';
    renderLayout();

    expect(screen.getByRole('tab', { name: localization.tabs.dataProducts })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: localization.tabs.variableDefinitions })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it.each([
    ['/variable-definitions', localization.migrationVariableDefinitions.header],
    ['/data-products', localization.info.datasetPrototypeIntro],
    ['/classifications', localization.migrationClassifications.header],
  ])('renders the info message for %s above the tab selection', (pathname, infoHeader) => {
    mocks.pathname = pathname;
    renderLayout();

    const infoHeading = screen.getByRole('heading', { name: infoHeader });
    const firstTab = screen.getByRole('tab', { name: localization.tabs.variableDefinitions });

    expect(infoHeading).toBeInTheDocument();
    expect(infoHeading.compareDocumentPosition(firstTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
  });

  it('renders the portal title and subtitle between the info message and the tabs', () => {
    renderLayout();

    const infoHeading = screen.getByRole('heading', { name: localization.migrationVariableDefinitions.header });
    const title = screen.getByRole('heading', { name: localization.appTitle });
    const subtitles = localization.appSubTitle.map((paragraph) => screen.getByText(paragraph));
    const firstSubtitle = subtitles[0];
    const lastSubtitle = subtitles[subtitles.length - 1];
    const firstTab = screen.getByRole('tab', { name: localization.tabs.variableDefinitions });

    expect(title).toBeInTheDocument();
    expect(subtitles).toHaveLength(localization.appSubTitle.length);
    expect(infoHeading.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
    expect(title.compareDocumentPosition(firstSubtitle!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
    expect(lastSubtitle!.compareDocumentPosition(firstTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(0);
  });

  it('renders a link-styled summary that opens the about content', () => {
    renderLayout();

    const summary = screen.getByText(localization.info.aboutDataportal.toggle);
    const details = summary.closest('details');

    expect(details).not.toBeNull();
    expect(details).not.toHaveProperty('open', true);

    fireEvent.click(summary);

    expect(details).toHaveProperty('open', true);
    expect(screen.getByRole('heading', { name: localization.info.aboutDataportal.title })).toBeInTheDocument();
    localization.info.aboutDataportal.body.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it('swaps the info message when switching tabs', () => {
    mocks.pathname = '/classifications';
    const { rerender } = renderLayout();

    expect(screen.getByRole('heading', { name: localization.migrationClassifications.header })).toBeInTheDocument();

    mocks.pathname = '/variable-definitions';
    rerender(
      <SearchLayout>
        <div data-testid='tab-content' />
      </SearchLayout>,
    );

    expect(screen.queryByRole('heading', { name: localization.migrationClassifications.header })).toBeNull();
    expect(screen.getByRole('heading', { name: localization.migrationVariableDefinitions.header })).toBeInTheDocument();
  });
});
