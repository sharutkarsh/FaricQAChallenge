import { test, expect } from '../../fixtures/testFixture';
import { testData } from '../../config/testData';

test.describe('nopCommerce — API Smoke Tests', () => {

  test('GET /search returns 200 with results for a known product', async ({ page, homePage }) => {
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes(testData.api.searchEndpoint) && r.request().method() === 'GET'),
      page.goto(`/search?q=${encodeURIComponent(testData.product.searchTerm)}`),
    ]);

    expect(response.status(), 'Search endpoint status').toBe(testData.api.successStatus);
    expect(response.headers()['content-type']).toContain(testData.api.contentTypeHtml);
    await expect(homePage.firstProductResult).toBeVisible();
  });

  test('GET /order redirects unauthenticated users — does not 500', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes(testData.api.orderEndpoint) && r.request().method() === 'GET'),
      page.goto(testData.api.orderEndpoint),
    ]);

    expect(response.status(), 'Order endpoint should not 5xx').toBeLessThan(testData.api.serverErrorThreshold);
  });

});
