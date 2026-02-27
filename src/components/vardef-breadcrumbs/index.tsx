import { Breadcrumbs } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

export type BreadcrumbItem = {
  href: string;
  text: string;
};

export type VardefBreadcrumbsProps = { homeUrl: BreadcrumbItem; items: BreadcrumbItem[]; currentText?: string };

export const VardefBreadcrumbs = ({ homeUrl, items, currentText }: VardefBreadcrumbsProps) => {
  return (
    <div style={{ padding: '1rem 0' }} data-testid='vardefBreadcrumbs'>
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
    </div>
  );
};
