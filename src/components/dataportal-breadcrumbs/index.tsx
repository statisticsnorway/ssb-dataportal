import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink, BreadcrumbsList } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

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
        <BreadcrumbsList>
          <BreadcrumbsItem>
            <BreadcrumbsLink href={homeUrl.href}>{homeUrl.text}</BreadcrumbsLink>
          </BreadcrumbsItem>
          {items.map((crumb, index) => (
            <BreadcrumbsItem key={`${crumb.href}-${index}`}>
              <BreadcrumbsLink href={crumb.href}>{crumb.text}</BreadcrumbsLink>
            </BreadcrumbsItem>
          ))}
          {currentText && (
            <BreadcrumbsItem>
              <BreadcrumbsLink href={undefined} aria-current='page'>
                {currentText}
              </BreadcrumbsLink>
            </BreadcrumbsItem>
          )}
        </BreadcrumbsList>
      </Breadcrumbs>
    </nav>
  );
};
