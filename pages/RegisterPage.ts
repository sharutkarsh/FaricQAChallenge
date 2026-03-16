import { BasePage, expect } from './BasePage';
import { testData } from '../config/testData';

export class RegisterPage extends BasePage {

  // ================= LOCATORS =================

  readonly registerLink         = this.page.locator("xpath=//*[contains(@class,'ico-register')]");
  readonly firstNameInput       = this.page.locator("xpath=//*[@id='FirstName']");
  readonly lastNameInput        = this.page.locator("xpath=//*[@id='LastName']");
  readonly emailInput           = this.page.locator("xpath=//*[@id='Email']");
  readonly passwordInput        = this.page.locator("xpath=//*[@id='Password']");
  readonly confirmPasswordInput = this.page.locator("xpath=//*[@id='ConfirmPassword']");
  readonly registerButton       = this.page.locator("xpath=//*[@id='register-button']");
  readonly successMessage       = this.page.locator("xpath=//div[contains(@class,'result') and not(contains(@class,'registration-result-page')) and not(contains(@class,'newsletter-result'))]");
  readonly logoutLink           = this.page.locator("xpath=//*[contains(@class,'ico-logout')]");

  // ================= ACTIONS =================

  async openRegister() {
    await expect(this.registerLink).toBeVisible();
    await this.registerLink.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async registerUser(email: string, password: string) {
    await this.firstNameInput.fill(testData.user.firstName);
    await this.lastNameInput.fill(testData.user.lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerButton.click();
  }

  // ================= ASSERTIONS =================

  async assertRegistrationSuccess() {
    await expect(this.successMessage).toContainText(testData.expected.registrationSuccess);
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }

}
