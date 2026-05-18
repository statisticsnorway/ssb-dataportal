import {
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
  Breadcrumbs as BreadcrumbsRoot,
} from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  List: BreadcrumbsList,
});

export type BreadcrumbItem = {
  href: string;
  text: string;
};

export type DataportalBreadcrumbsProps = {
  homeUrl: BreadcrumbItem;
  items: BreadcrumbItem[];
  currentText?: string;
};

export const DataportalBreadcrumbs = ({ homeUrl, items, currentText }: DataportalBreadcrumbsProps) => {
  return (
    <nav style={{ padding: '1rem 0' }} data-testid='dataportalBreadcrumbs'>
      <Breadcrumbs aria-label={localization.breadcrumbsLabel}>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href={homeUrl.href}>{homeUrl.text}</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          {items.map((crumb, index) => (
            <Breadcrumbs.Item key={`${crumb.href}-${index}`}>
              <Breadcrumbs.Link href={crumb.href}>{crumb.text}</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          ))}
          {currentText && (
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href={undefined} aria-current='page'>
                {currentText}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
          )}
        </Breadcrumbs.List>
      </Breadcrumbs>
    </nav>
  );
};
