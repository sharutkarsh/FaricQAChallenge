import { test as base } from '@playwright/test';

import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';

type PageFixtures = {

  registerPage: RegisterPage
  loginPage: LoginPage
  homePage: HomePage
  productPage: ProductPage
  cartPage: CartPage
  checkoutPage: CheckoutPage
  ordersPage: OrdersPage

}

export const test = base.extend<PageFixtures>({

  registerPage: async ({ page }, use) => {

    const registerPage = new RegisterPage(page)
    await use(registerPage)

  },

  loginPage: async ({ page }, use) => {

    const loginPage = new LoginPage(page)
    await use(loginPage)

  },

  homePage: async ({ page }, use) => {

    const homePage = new HomePage(page)
    await use(homePage)

  },

  productPage: async ({ page }, use) => {

    const productPage = new ProductPage(page)
    await use(productPage)

  },

  cartPage: async ({ page }, use) => {

    const cartPage = new CartPage(page)
    await use(cartPage)

  },

  checkoutPage: async ({ page }, use) => {

    const checkoutPage = new CheckoutPage(page)
    await use(checkoutPage)

  },

  ordersPage: async ({ page }, use) => {

    const ordersPage = new OrdersPage(page)
    await use(ordersPage)

  }

})

export { expect } from '@playwright/test'