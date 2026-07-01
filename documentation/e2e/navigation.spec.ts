import { test, expect } from '@playwright/test';

const GITHUB_URL = 'https://github.com/Soroban-Cookbook/Soroban_Cookbook_online';

test.describe('desktop navigation', () => {
  test('home → Docs → pattern page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Soroban Cookbook/);

    // Navbar "Docs" link leads to the docs section
    await page.getByRole('link', { name: 'Docs' }).first().click();
    await expect(page).toHaveURL(/\/docs\//);

    // Navigate to a pattern page via the sidebar
    await page.getByRole('link', { name: 'Patterns' }).first().click();
    // Expand if collapsed (Docusaurus category may be a button)
    const overviewLink = page.getByRole('link', { name: 'Overview' });
    if (await overviewLink.isVisible()) {
      await overviewLink.click();
    }
    await expect(page).toHaveURL(/\/docs\/patterns/);
  });

  test('GitHub navbar link points to correct repo', async ({ page, context }) => {
    await page.goto('/');

    // The GitHub link opens in a new tab — intercept and assert href without navigating
    const githubLink = page.getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toHaveAttribute('href', GITHUB_URL);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger opens nav and Docs link is reachable', async ({ page }) => {
    await page.goto('/');

    // Docusaurus mobile toggle
    const toggle = page.locator('.navbar__toggle, [aria-label="Toggle navigation bar"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Sidebar/drawer should now contain the Docs link
    const docsLink = page.getByRole('link', { name: 'Docs' }).first();
    await expect(docsLink).toBeVisible();
    await docsLink.click();
    await expect(page).toHaveURL(/\/docs\//);
  });

  test('mobile menu contains GitHub link', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('.navbar__toggle, [aria-label="Toggle navigation bar"]').first();
    await toggle.click();

    const githubLink = page.getByRole('link', { name: 'GitHub' });
    await expect(githubLink.first()).toBeVisible();
  });
});
