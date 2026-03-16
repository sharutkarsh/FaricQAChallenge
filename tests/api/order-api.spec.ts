import { test, expect, request } from '@playwright/test';
import { testData } from '../../config/testData';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

test.describe('nopCommerce — API Smoke Tests', () => {

  test('GET /search returns 200 with results for a known product', async () => {
    const api = await request.newContext({
      baseURL: testData.baseUrl,
      extraHTTPHeaders: BROWSER_HEADERS,
    });

    const response = await api.get('/search', {
      params: { q: testData.product.searchTerm },
    });

    expect(response.status(), 'Search endpoint status').toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    const body = await response.text();
    expect(body).toContain(testData.product.searchTerm);

    await api.dispose();
  });

  test('GET /order redirects unauthenticated users — does not 500', async () => {
    const api = await request.newContext({
      baseURL: testData.baseUrl,
      extraHTTPHeaders: BROWSER_HEADERS,
    });

    const response = await api.get('/order');

    expect(response.status(), 'Order endpoint should not 5xx').toBeLessThan(500);

    await api.dispose();
  });

});
