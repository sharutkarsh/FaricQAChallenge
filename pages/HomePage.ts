import { BasePage, expect } from './BasePage';
import { validateSearchAPI } from '../utils/networkHelper';

export class HomePage extends BasePage {

  // ================= LOCATORS =================

  readonly searchInput        = this.page.locator("xpath=//*[@id='small-searchterms']");
  readonly searchButton       = this.page.locator("xpath=//button[@type='submit' and contains(@class,'search-box-button')]");
  readonly firstProductResult = this.page.locator("xpath=//*[contains(@class,'product-item')]").first();

  // ================= ACTIONS =================

  async searchProduct(term: string) {
    const searchResponsePromise = validateSearchAPI(this.page);

    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(term);
    await this.searchButton.click();

    await searchResponsePromise;
  }

  // ================= ASSERTIONS =================

  async assertSearchResultsVisible() {
    await expect(this.firstProductResult).toBeVisible();
  }

}
