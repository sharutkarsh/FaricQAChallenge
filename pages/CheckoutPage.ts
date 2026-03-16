import { BasePage, expect } from './BasePage';
import { testData } from '../config/testData';

export class CheckoutPage extends BasePage {

  // ================= LOCATORS =================

  readonly billingCountrySelect         = this.page.locator("xpath=//*[@id='BillingNewAddress_CountryId']");
  readonly billingStateSelect           = this.page.locator("xpath=//*[@id='BillingNewAddress_StateProvinceId']");
  readonly billingCityInput             = this.page.locator("xpath=//*[@id='BillingNewAddress_City']");
  readonly billingAddressInput          = this.page.locator("xpath=//*[@id='BillingNewAddress_Address1']");
  readonly billingZipInput              = this.page.locator("xpath=//*[@id='BillingNewAddress_ZipPostalCode']");
  readonly billingPhoneInput            = this.page.locator("xpath=//*[@id='BillingNewAddress_PhoneNumber']");
  readonly billingContinue              = this.page.locator("xpath=//*[@id='billing-buttons-container']//button[contains(text(),'Continue')]");
  readonly shippingMethodContinue       = this.page.locator("xpath=//*[@id='shipping-method-buttons-container']//button[contains(text(),'Continue')]");
  readonly paymentMethodContinue        = this.page.locator("xpath=//*[@id='payment-method-buttons-container']//button[contains(text(),'Continue')]");
  readonly paymentInfoContinue          = this.page.locator("xpath=//*[@id='payment-info-buttons-container']//button[contains(text(),'Continue')]");
  readonly confirmButton                = this.page.locator("xpath=//*[@id='confirm-order-buttons-container']//button[contains(text(),'Confirm')]");
  readonly confirmOrderButtonsContainer = this.page.locator("xpath=//*[@id='confirm-order-buttons-container']");
  readonly thankYouTitle                = this.page.locator("xpath=//*[contains(@class,'title') and contains(.,'Your order has been successfully processed')]");
  readonly orderNumberText              = this.page.locator("xpath=//*[contains(@class,'order-number')]");
  readonly orderDetailsLink             = this.page.getByRole('link', { name: 'Click here for order details' });

  // ================= ACTIONS =================

  async fillBillingDetails() {
    await expect(this.billingCountrySelect).toBeVisible();
    const statesResponse = this.page.waitForResponse(
      r => r.url().includes(testData.api.statesEndpoint)
    );
    await this.billingCountrySelect.selectOption({ label: testData.billing.country });
    await statesResponse;
    await expect(this.billingStateSelect).toBeVisible();
    await this.billingStateSelect.selectOption({ label: testData.billing.state });
    await this.billingCityInput.fill(testData.billing.city);
    await this.billingAddressInput.fill(testData.billing.address);
    await this.billingZipInput.fill(testData.billing.zip);
    await this.billingPhoneInput.fill(testData.billing.phone);
    await this.billingContinue.click();
  }

  async selectShippingMethod() {
    await expect(this.shippingMethodContinue).toBeVisible();
    await this.shippingMethodContinue.click();
  }

  async selectPaymentMethod() {
    await expect(this.paymentMethodContinue).toBeVisible();
    await this.paymentMethodContinue.click();
  }

  async confirmPaymentInfo() {
    await expect(this.paymentInfoContinue).toBeVisible();
    await this.paymentInfoContinue.dispatchEvent('click');
    await this.confirmOrderButtonsContainer.waitFor({ state: 'visible', timeout: 20000 });
  }

  async confirmOrder() {
    await expect(this.confirmButton).toBeVisible();
    await this.confirmButton.click();
  }

  // ================= ASSERTIONS =================

  async assertOrderConfirmed() {
    await expect(this.thankYouTitle).toBeVisible();
    await expect(this.orderNumberText).toBeVisible();
  }

  async getOrderNumber(): Promise<string> {
    await expect(this.orderNumberText).toBeVisible();
    const text = await this.orderNumberText.innerText();
    return text.replace(/\D/g, '');
  }

  async goToOrderDetails() {
    await expect(this.orderDetailsLink).toBeVisible();
    await this.orderDetailsLink.click();
  }

}
