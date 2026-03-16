import { BasePage, expect } from './BasePage';

export class CartPage extends BasePage {

  // ================= LOCATORS =================

  readonly cartLink       = this.page.locator("xpath=//*[@id='topcartlink']");
  readonly cartItems      = this.page.locator("xpath=//*[contains(@class,'cart')]//tbody//tr");
  readonly termsCheckbox  = this.page.locator("xpath=//*[@id='termsofservice']");
  readonly checkoutButton = this.page.locator("xpath=//*[@id='checkout']");

  // ================= ACTIONS =================

  async openCart() {
    // Dismiss the add-to-cart notification bar if it is still overlaying the header
    const notification = this.page.locator("xpath=//*[@id='bar-notification']");
    const closeBtn = this.page.locator("xpath=//*[@id='bar-notification']//*[contains(@class,'close')]");
    if (await notification.isVisible()) {
      await closeBtn.click();
      await notification.waitFor({ state: 'hidden' });
    }
    await this.cartLink.click();
    await expect(this.cartItems.first()).toBeVisible();
  }

  async proceedToCheckout() {
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout/, { waitUntil: 'domcontentloaded' });
  }

  // ================= ASSERTIONS =================

  async assertCartHasItems() {
    await expect(this.cartItems.first()).toBeVisible();
  }

}
