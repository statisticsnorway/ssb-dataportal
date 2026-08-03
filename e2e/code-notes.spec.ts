import { localization } from '@/libs/language';
import { expect, test } from './fixtures/codesPage.fixture';

// fikse test
const codeWithNotes = { code: 'C', name: 'Industri' };
const codeWithoutNotes = { code: 'B', name: 'Bergverksdrift og utvinning' };

const notesButtonLabel = (name: string) => `${localization.codeTree.notesButtonLabel} ${name}`;

test.describe('Code notes info icon and dialog', () => {
  test('info icon is visible for codes that have notes', async ({ codesPage }) => {
    await expect(codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) })).toBeVisible();
  });

  test('info icon is not rendered for codes without notes', async ({ codesPage }) => {
    await expect(codesPage.getByRole('button', { name: notesButtonLabel(codeWithoutNotes.name) })).not.toBeAttached();
  });

  test('clicking the info icon opens a dialog', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) }).click();
    await expect(codesPage.getByRole('dialog')).toBeVisible();
  });

  test('dialog shows the code name as the heading', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) }).click();
    await expect(codesPage.getByRole('dialog').getByRole('heading', { level: 1 })).toHaveText(codeWithNotes.name);
  });

  test('dialog shows parsed notes sections with headings', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) }).click();

    const dialog = codesPage.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Omfatter', exact: true })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Omfatter også' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Ekskluderer' })).toBeVisible();
  });

  test('dialog shows the notes content text', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) }).click();

    const dialog = codesPage.getByRole('dialog');
    await expect(
      dialog.getByText(
        'Dette næringshovedområdet omfatter bearbeiding og foredling av materialer og stoffer til nye produkter.',
      ),
    ).toBeVisible();
  });

  test('dialog can be closed', async ({ codesPage }) => {
    await codesPage.getByRole('button', { name: notesButtonLabel(codeWithNotes.name) }).click();
    await expect(codesPage.getByRole('dialog')).toBeVisible();

    await codesPage.keyboard.press('Escape');
    await expect(codesPage.getByRole('dialog')).not.toBeVisible();
  });
});
