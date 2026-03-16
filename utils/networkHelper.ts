import { Page, expect } from '@playwright/test';
import { validateSchema } from './schemaValidator';

function sanitize(value: string): string {
  return value.replace(/[\r\n]/g, ' ');
}

export function monitorNetworkFailures(page: Page): void {
  page.on('requestfailed', request => {
    console.error(`[Network Failure] ${sanitize(request.method())} ${sanitize(request.url())} — ${sanitize(request.failure()?.errorText ?? '')}`);
  });
}

/**
 * Waits for the search page response and validates status + method.
 */
export async function validateSearchAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes('/search') && r.request().method() === 'GET'
  );
  expect(response.status(), 'Search API status').toBe(200);
  console.log(`[Search API] ${response.status()} ${sanitize(response.url())}`);
}

/**
 * Waits for the add-to-cart API response and validates status + body.
 */
export async function validateAddToCartAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes('addproducttocart') && r.request().method() === 'POST'
  );
  expect(response.status(), 'Add-to-cart API status').toBe(200);
  const body = await response.json();
  expect(body.success, 'Add-to-cart response success flag').toBe(true);
  console.log(`[Add-to-Cart API] ${response.status()} — success: ${body.success}`);
}

/**
 * Waits for the checkout billing step POST and validates status.
 */
export async function validateCheckoutBillingAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes('OpcSaveBilling') && r.request().method() === 'POST'
  );
  expect(response.status(), 'Billing step API status').toBe(200);
  const body = await response.json();
  expect(body.error, 'Billing step should have no error').toBeFalsy();
  console.log(`[Checkout Billing API] ${response.status()}`);
}

/**
 * Waits for the final confirm order POST and validates status + schema.
 */
export async function validateCheckoutAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => (
      r.url().includes('/checkout/completed') ||
      r.url().includes('OpcConfirmOrder')
    ) && r.request().method() === 'POST'
  );
  expect(response.status(), 'Checkout confirm API status').toBe(200);
  const body = await response.json().catch(() => ({}));
  console.log('[Checkout Confirm API]', sanitize(JSON.stringify(body)));
  if (Object.keys(body).length > 0) {
    validateSchema('checkoutSchema', body);
  }
}
