import { Breadcrumbs } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

export type BreadcrumbType = {
  href: string;
  text: string;
};

export type VardefBreadcrumbsProps = { homeUrl: BreadcrumbType; breadcrumbList: BreadcrumbType[] };

export const VardefBreadcrumbs = ({ homeUrl, breadcrumbList }: VardefBreadcrumbsProps) => {
  return (
    <div style={{ padding: '1rem 0' }} data-testid='vardefBreadcrumbs'>
      <Breadcrumbs aria-label={localization.breadcrumbsLabel}>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href={homeUrl.href}>{homeUrl.text}</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          {breadcrumbList.map((crumb, index) => {
            const isLast = index === breadcrumbList.length - 1;
            return (
              <Breadcrumbs.Item key={crumb.href}>
                <Breadcrumbs.Link href={isLast ? undefined : crumb.href} aria-current={isLast ? 'page' : undefined}>
                  {crumb.text}
                </Breadcrumbs.Link>
              </Breadcrumbs.Item>
            );
          })}
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  );
};
