import { BreadcrumbItem } from '@/components/dataportal-breadcrumbs';
import { localization } from '@/libs/language';

export function getHomeBreadcrumb(): BreadcrumbItem {
  return {
    text: localization.home,
    href: '/',
  };
}
