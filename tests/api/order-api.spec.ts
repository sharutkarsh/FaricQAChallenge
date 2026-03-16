import { test, expect } from '@playwright/test';
import { testData } from '../../config/testData';

test.describe('nopCommerce — API Smoke Tests', () => {

  test('GET /search returns 200 with results for a known product', async ({ page }) => {
    // page.request does not share Cloudflare clearance cookies with the browser context.
    // Intercept the network response triggered by browser navigation instead.
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/search') && r.request().method() === 'GET'),
      page.goto(`/search?q=${encodeURIComponent(testData.product.searchTerm)}`),
    ]);

    expect(response.status(), 'Search endpoint status').toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    await expect(page.locator("xpath=//*[contains(@class,'product-item')]").first()).toBeVisible();
  });

  test('GET /order redirects unauthenticated users — does not 500', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/order') && r.request().method() === 'GET'),
      page.goto('/order'),
    ]);

    expect(response.status(), 'Order endpoint should not 5xx').toBeLessThan(500);
  });

});
