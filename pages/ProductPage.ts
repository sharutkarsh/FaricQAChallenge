import { BasePage, expect } from './BasePage';
import { validateAddToCartAPI } from '../utils/networkHelper';
import { testData } from '../config/testData';

export class ProductPage extends BasePage {

  // ================= LOCATORS =================

  readonly firstProductTitle       = this.page.locator("xpath=(//*[contains(@class,'product-title')]//a)[1]");
  readonly productName             = this.page.locator("xpath=//*[contains(@class,'product-name')]");
  readonly productPrice            = this.page.locator("xpath=(//*[contains(@class,'product-price')]//span)[1]");
  readonly productDescription      = this.page.locator("xpath=//*[contains(@class,'full-description')]");
  readonly addToCartButton         = this.page.locator("xpath=//*[@id='product-details-form']//button[contains(@id,'add-to-cart-button')]");
  readonly cartSuccessNotification = this.page.locator("xpath=//*[@id='bar-notification']");

  // ================= ACTIONS =================

  async openFirstProduct() {
    await expect(this.firstProductTitle).toBeVisible();
    await this.firstProductTitle.click();
    await this.page.waitForURL(/\/[\w-]+$/, { waitUntil: 'domcontentloaded' });
    await expect(this.productName).toBeVisible();
  }

  async addToCart() {
    const cartAPI = validateAddToCartAPI(this.page);
    await this.addToCartButton.click();
    await cartAPI;
  }

  // ================= ASSERTIONS =================

  async assertProductDetails() {
    await expect(this.productName, 'Product title should be visible').toBeVisible();
    await expect(this.productPrice, 'Product price should be visible').toBeVisible();
    await expect(this.productDescription, 'Product description should be visible').toBeVisible();
    await expect(this.cartSuccessNotification).not.toBeVisible();
  }

  async assertAddedToCart() {
    await expect(this.cartSuccessNotification).toBeVisible();
    await expect(this.cartSuccessNotification).toContainText(testData.expected.addToCartSuccess);
  }

}
