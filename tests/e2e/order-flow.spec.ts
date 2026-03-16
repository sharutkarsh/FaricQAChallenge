import { test, expect } from '../../fixtures/testFixture';
import { generateRandomEmail } from '../../utils/randomData';
import { validateCheckoutAPI } from '../../utils/networkHelper';
import { testData } from '../../config/testData';

test.describe('nopCommerce — Full Order Flow', () => {

  test('Register → Login → Search → Add to Cart → Checkout → Orders → Logout', async ({
    page,
    registerPage,
    loginPage,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    ordersPage,
  }) => {

    const email    = generateRandomEmail();
    const password = testData.user.password;

    await test.step('1. Navigate to the nopCommerce application', async () => {
      await page.goto('/');
      await expect(page).toHaveURL(testData.expected.homeUrlPattern);
      await page.locator(testData.expected.headerSelector).waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('2. Register new user with a unique randomly generated email', async () => {
      await registerPage.openRegister();
      await registerPage.registerUser(email, password);
      await registerPage.assertRegistrationSuccess();
    });

    await test.step('3. Login with the newly created user', async () => {
      await loginPage.login(email, password);
      await loginPage.assertLoggedIn();
    });

    await test.step('4. Search for a product and verify search results', async () => {
      await homePage.searchProduct(testData.product.searchTerm);
      await homePage.assertSearchResultsVisible();
    });

    await test.step('5. Select a product and validate product details', async () => {
      await productPage.openFirstProduct();
      await productPage.validateProductDetails();
    });

    await test.step('6. Add the product to the shopping cart', async () => {
      await productPage.addToCart();
      await productPage.assertAddedToCart();
    });

    await test.step('7. Proceed to checkout and complete the order', async () => {
      await cartPage.openCart();
      await cartPage.assertCartHasItems();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillBillingDetails();
      await checkoutPage.selectShippingMethod();
      await checkoutPage.selectPaymentMethod();
      await checkoutPage.confirmPaymentInfo();
    });

    await test.step('8. Intercept and validate checkout API network requests', async () => {
      const checkoutAPI = validateCheckoutAPI(page);
      await checkoutPage.confirmOrder();
      await checkoutAPI;
      await checkoutPage.assertOrderConfirmed();
    });

    await test.step('9. Navigate to Orders page and validate order details', async () => {
      await checkoutPage.goToOrderDetails();
      await ordersPage.assertOrderDetailPage();
    });

    await test.step('10. Logout and verify logout is successful', async () => {
      await loginPage.logout();
      await loginPage.assertLoggedOut();
    });

  });

});
