import { Page, expect } from '@playwright/test';
import { validateSchema } from './schemaValidator';
import { testData } from '../config/testData';

function sanitize(value: string): string {
  return value.replace(/[\r\n]/g, ' ');
}

export function monitorNetworkFailures(page: Page): void {
  page.on('requestfailed', request => {
    console.error(`[Network Failure] ${sanitize(request.method())} ${sanitize(request.url())} — ${sanitize(request.failure()?.errorText ?? '')}`);
  });
}

export async function validateSearchAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes(testData.api.searchEndpoint) && r.request().method() === 'GET'
  );
  expect(response.status(), 'Search API status').toBe(testData.api.successStatus);
  console.log(`[Search API] ${response.status()} ${sanitize(response.url())}`);
}


export async function validateAddToCartAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes(testData.api.addToCartEndpoint) && r.request().method() === 'POST'
  );
  expect(response.status(), 'Add-to-cart API status').toBe(testData.api.successStatus);
  const body = await response.json();
  expect(body.success, 'Add-to-cart response success flag').toBe(true);
  console.log(`[Add-to-Cart API] ${response.status()} — success: ${sanitize(String(body.success))}`);
}

export async function validateCheckoutBillingAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => r.url().includes(testData.api.billingEndpoint) && r.request().method() === 'POST'
  );
  expect(response.status(), 'Billing step API status').toBe(testData.api.successStatus);
  const body = await response.json();
  expect(body.error, 'Billing step should have no error').toBeFalsy();
  console.log(`[Checkout Billing API] ${sanitize(String(response.status()))}`);
}

export async function validateCheckoutAPI(page: Page): Promise<void> {
  const response = await page.waitForResponse(
    r => (
      r.url().includes(testData.api.checkoutCompletedUrl) ||
      r.url().includes(testData.api.confirmOrderEndpoint)
    ) && r.request().method() === 'POST'
  );
  expect(response.status(), 'Checkout confirm API status').toBe(testData.api.successStatus);
  const body = await response.json().catch(() => ({}));
  console.log(`[Checkout Confirm API] ${sanitize(JSON.stringify(body))}`);
  if (Object.keys(body).length > 0) {
    validateSchema(testData.api.checkoutSchemaName, body);
  }
}
