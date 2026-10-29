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

  describe('tab bar scrolling', () => {
    const mockOverflowingTabList = () => {
      const tabList = screen.getByRole('tablist', { hidden: true }) as HTMLElement;
      Object.defineProperty(tabList, 'scrollWidth', { configurable: true, value: 600 });
      Object.defineProperty(tabList, 'clientWidth', { configurable: true, value: 300 });
      tabList.getBoundingClientRect = () => ({ left: 0, right: 300, width: 300 }) as DOMRect;
      tabList.scrollTo = vi.fn();
      const selected = tabList.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      selected!.getBoundingClientRect = () => ({ left: 400, right: 560, width: 160 }) as DOMRect;
      return tabList;
    };

    it('renders all tabs in a single labelled tab list', () => {
      renderLayout();

      const tabList = screen.getByRole('tablist', { hidden: true });
      expect(tabList).toHaveAccessibleName(localization.tabs.ariaLabel);
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('scrolls the selected tab into view inside the tab bar on resize', () => {
      mocks.pathname = '/data-products';
      renderLayout();
      const tabList = mockOverflowingTabList();

      fireEvent(window, new Event('resize'));

      // Centers the tab (centre at 480) in the 300px wide list, clamped to the max scroll of 300.
      expect(tabList.scrollTo).toHaveBeenCalledWith({ left: 300, behavior: 'auto' });
    });

    it('does not scroll when the tabs fit', () => {
      renderLayout();
      const tabList = screen.getByRole('tablist', { hidden: true }) as HTMLElement;
      tabList.scrollTo = vi.fn();

      fireEvent(window, new Event('resize'));

      expect(tabList.scrollTo).not.toHaveBeenCalled();
    });
  });
});
