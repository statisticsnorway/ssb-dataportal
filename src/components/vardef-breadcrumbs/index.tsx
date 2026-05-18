import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsLink, BreadcrumbsList } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

export type BreadcrumbItem = {
  href: string;
  text: string;
};

export type VardefBreadcrumbsProps = {
  homeUrl: BreadcrumbItem;
  items: BreadcrumbItem[];
  currentText?: string;
};

export const VardefBreadcrumbs = ({ homeUrl, items, currentText }: VardefBreadcrumbsProps) => {
  return (
    <nav style={{ padding: '1rem 0' }} data-testid='vardefBreadcrumbs'>
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
