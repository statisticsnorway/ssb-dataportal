import { localization } from '@/libs/language';
import test, { expect } from '@playwright/test';
import { stabilize } from './utils/commonUtils';

test('Data product datasets can be filtered by assessment', async ({ page }) => {
  await page.goto('/data-products/arbstatus');
  await stabilize();

  const main = page.getByRole('main');
  const protectedFilter = main.getByRole('checkbox', { name: localization.products.assessment.protected });
  const openFilter = main.getByRole('checkbox', { name: localization.products.assessment.open });
  const sensitiveFilter = main.getByRole('checkbox', { name: localization.products.assessment.sensitive });

  await protectedFilter.check();
  const heading1 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 1' });
  const heading2 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 2' });
  const heading3 = page.getByRole('heading', { name: 'Arbeidsstatus datasett 3' });
  await expect(heading2).toBeVisible();
  await expect(heading1).not.toBeVisible();
  await expect(heading3).not.toBeVisible();

  await openFilter.check();
  await expect(heading1).toBeVisible();

  await protectedFilter.uncheck();
  await expect(heading2).not.toBeVisible();

  await sensitiveFilter.check();
  await expect(heading3).toBeVisible();
});
