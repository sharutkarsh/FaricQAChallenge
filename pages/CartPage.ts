import { BasePage, expect } from './BasePage';

export class CartPage extends BasePage {

  // ================= LOCATORS =================

  readonly cartLink            = this.page.locator("xpath=//*[@id='topcartlink']");
  readonly cartItems           = this.page.locator("xpath=//*[contains(@class,'cart')]//tbody//tr");
  readonly termsCheckbox       = this.page.locator("xpath=//*[@id='termsofservice']");
  readonly checkoutButton      = this.page.locator("xpath=//*[@id='checkout']");
  readonly notification        = this.page.locator("xpath=//*[@id='bar-notification']");
  readonly notificationCloseBtn = this.page.locator("xpath=//*[@id='bar-notification']//*[contains(@class,'close')]");

  // ================= ACTIONS =================

  async openCart() {
    if (await this.notification.isVisible()) {
      await this.notificationCloseBtn.click();
      await this.notification.waitFor({ state: 'hidden' });
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
