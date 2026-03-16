import { BasePage, expect } from './BasePage';

export class LoginPage extends BasePage {

  // ================= LOCATORS =================

  readonly loginLink     = this.page.getByRole('link', { name: 'Log in' });
  readonly emailInput    = this.page.locator("xpath=//*[@id='Email']");
  readonly passwordInput = this.page.locator("xpath=//*[@id='Password']");
  readonly loginButton   = this.page.getByRole('button', { name: 'Log in' });
  readonly accountLink   = this.page.locator("xpath=//*[contains(@class,'ico-account')]");
  readonly logoutLink    = this.page.locator("xpath=//*[contains(@class,'ico-logout')]");

  // ================= ACTIONS =================

  async login(email: string, password: string) {
    await expect(this.loginLink).toBeVisible({ timeout: 30000 });
    await this.loginLink.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }

  // ================= ASSERTIONS =================

  async assertLoggedIn() {
    await expect(this.accountLink).toBeVisible();
  }

  async assertLoggedOut() {
    await expect(this.loginLink).toBeVisible();
  }

}
