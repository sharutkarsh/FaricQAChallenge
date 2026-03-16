import { Page, expect } from '@playwright/test';

export { expect };

export class BasePage {

  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

}
