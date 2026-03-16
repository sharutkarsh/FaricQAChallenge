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
      await expect(page).toHaveURL(/demo\.nopcommerce\.com/);
      await page.locator('.header').waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('2. Register new user with a unique randomly generated email', async () => {
      await registerPage.openRegister();
      await registerPage.registerUser(email, password);
      await registerPage.assertRegistrationSuccess(); // asserts success message then logs out
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
      // Cart page (SS1) — accept terms and go to checkout
      await cartPage.openCart();
      await cartPage.assertCartHasItems();
      await cartPage.proceedToCheckout();

      // Step 1: Billing address (SS2)
      await checkoutPage.fillBillingDetails();

      // Step 3: Shipping method — Ground pre-selected (SS3)
      await checkoutPage.selectShippingMethod();

      // Step 4: Payment method — Check/Money Order pre-selected (SS4)
      await checkoutPage.selectPaymentMethod();

      // Step 5: Payment information (SS5)
      await checkoutPage.confirmPaymentInfo();
    });

    await test.step('8. Intercept and validate checkout API network requests', async () => {
      // Register listener before the confirm click (SS6)
      const checkoutAPI = validateCheckoutAPI(page);
      await checkoutPage.confirmOrder();
      await checkoutAPI; // validates POST response

      // Thank-you page assertions (SS7)
      await checkoutPage.assertOrderConfirmed();
    });

    await test.step('9. Navigate to Orders page and validate order details', async () => {
      const orderNumber = await checkoutPage.getOrderNumber();

      // Navigate directly via "Click here for order details" link on the thank-you page (SS7)
      await checkoutPage.goToOrderDetails();
      await ordersPage.assertOrderDetailPage();
    });

    await test.step('10. Logout and verify logout is successful', async () => {
      await loginPage.logout();
      await loginPage.assertLoggedOut();
    });

  });

});
