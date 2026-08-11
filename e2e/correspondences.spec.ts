import { expect, test } from './fixtures/classification.fixture';

const classificationId = 91;

test.describe('Correspondences', () => {
  test('shows correspondence tables on the latest version', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classificationId);
    await page.goto(`/classifications/${classificationId}/correspondences`);

    await expect(page.getByRole('heading', { name: 'Korrespondanser', level: 3 })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Landkoder \(SSB-3\) 2023 - Landkoder \(SSB-3\) 2019/ }),
    ).toHaveAttribute('href', '/correspondences/950?returnTo=/classifications/91/correspondences');
  });

  test('opens a correspondence detail page and filters mappings', async ({ classificationDetailsPage }) => {
    const page = await classificationDetailsPage(classificationId);
    await page.goto('/correspondences/1506?returnTo=/classifications/91/correspondences');

    await expect(page).toHaveURL(/\/correspondences\/1506/);
    await expect(
      page.getByRole('heading', { name: 'Landkoder (SSB-3) 2011 - Landkoder (SSB-3) 2009', level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Kildekode' })).toBeVisible();
    await expect(page.getByText('Sint Maarten (NL)')).toBeVisible();

    await page.getByLabel('Filtrer etter kode eller navn').fill('AN');
    await expect(page.getByText('De nederlandske Antiller')).toBeVisible();
    await expect(page.getByText('Norge')).not.toBeVisible();

    await expect(page.getByRole('link', { name: /Til korrespondanser/ })).toHaveAttribute(
      'href',
      '/classifications/91/correspondences',
    );
  });
});
