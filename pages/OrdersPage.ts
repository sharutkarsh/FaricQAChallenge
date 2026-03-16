import { BasePage, expect } from './BasePage';

export class OrdersPage extends BasePage {

  // ================= LOCATORS =================

  readonly myAccountLink         = this.page.locator("xpath=//*[contains(@class,'ico-account')]");
  readonly ordersLink            = this.page.getByRole('link', { name: 'Orders' }).first();
  readonly orderRows             = this.page.locator("xpath=//*[contains(@class,'order-item')]");
  readonly firstOrderDetailsLink = this.page.locator("xpath=(//*[contains(@class,'order-item')]//*[contains(@class,'buttons')]//a)[1]");

  // Order detail page
  readonly orderDetailTitle  = this.page.locator("xpath=//h1[contains(text(),'Order information')]");
  readonly orderDetailNumber = this.page.locator("xpath=//strong[contains(text(),'Order #')]");
  readonly orderDetailStatus = this.page.locator("xpath=//li[contains(text(),'Order Status:')]");
  readonly orderDetailTotal  = this.page.locator("xpath=//li[contains(text(),'Order Total:')]");

  // ================= ACTIONS =================

  async navigateToOrders() {
    await expect(this.myAccountLink).toBeVisible();
    await this.myAccountLink.click();
    await expect(this.ordersLink).toBeVisible();
    await this.ordersLink.click();
  }

  async openFirstOrder() {
    await expect(this.firstOrderDetailsLink).toBeVisible();
    await this.firstOrderDetailsLink.click();
  }

  // ================= ASSERTIONS =================

  async assertOrdersPageLoaded() {
    await expect(this.page).toHaveURL(/\/order\/history/);
    await expect(this.orderRows.first()).toBeVisible();
  }

  async assertOrderVisible(orderNumber: string) {
    const match = this.page.locator(`xpath=//*[contains(@class,'order-item') and contains(.,'${orderNumber}')]`);
    await expect(match).toBeVisible();
  }

  async assertOrderDetailPage() {
    await expect(this.orderDetailTitle).toBeVisible();
    await expect(this.orderDetailNumber).toBeVisible();
    await expect(this.orderDetailStatus).toContainText('Pending');
  }

}
