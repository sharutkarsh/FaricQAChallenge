# nopCommerce Playwright Automation Framework

Production-grade end-to-end automation framework for [demo.nopcommerce.com](https://demo.nopcommerce.com) built with Playwright and TypeScript.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & API interception |
| TypeScript | Type-safe test authoring |
| @faker-js/faker | Random test data generation |
| AJV | JSON schema validation for API responses |
| GitHub Actions | CI/CD pipeline with email reporting |

---

## Project Structure

```
├── config/
│   └── testData.ts          # Centralized test data (user, billing, product)
├── fixtures/
│   └── testFixture.ts       # Playwright fixture wiring all page objects
├── pages/
│   ├── BasePage.ts          # Base class shared by all page objects
│   ├── RegisterPage.ts
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── OrdersPage.ts
├── tests/
│   ├── e2e/
│   │   └── order-flow.spec.ts   # Full end-to-end test
│   └── api/
│       └── order-api.spec.ts    # API smoke tests
├── utils/
│   ├── networkHelper.ts     # API interception & validation helpers
│   ├── randomData.ts        # Faker-based data generators
│   └── schemaValidator.ts   # AJV JSON schema validator
├── schemas/
│   └── checkoutSchema.json  # JSON schema for checkout API response
├── .github/
│   └── workflows/
│       └── playwright.yml   # GitHub Actions CI/CD pipeline
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Test Flow

The end-to-end test covers all 11 required steps:

1. Navigate to the nopCommerce application.
2. Create a new user from user registration page (Ensure username is generated randomly and it is unique in every test
execution).
3. Login to the application with the created user.
4. Search for a product using the search bar and verify the search results.
5. Select a product and validate the product details.
6. Add the product to the shopping cart.
7. Proceed to checkout and complete the order.
8. While completing checkout, intercept and validate API network requests.
9. Navigate to Orders page and validate the order details.
10.Log out of the application and verify the logout is successful.


---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

```bash
# Run full suite (Chromium)
npm test

# Run headed locally
npm run test:headed

# Run API tests only
npm run test:api

# Open interactive UI mode
npm run test:ui

# Debug a specific test
npm run test:debug

# View last HTML report
npm run report

# Type-check without running tests
npm run typecheck
```

---

## Configuration

All test data lives in `config/testData.ts`:

```ts
export const testData = {
  baseUrl: 'https://demo.nopcommerce.com',
  user: {
    firstName: 'Test',
    lastName:  'User',
    password:  process.env.TEST_PASSWORD ?? 'Password123!',
  },
  billing: {
    country: 'United States of America',
    state:   'Alabama',
    city:    'St. Lois',
    address: 'Neshvaile Strret 5',
    zip:     '32001',
    phone:   '9999999999',
  },
  product: {
    searchTerm: 'Asus Laptop',
  },
};
```

The test email is generated fresh on every run using `@faker-js/faker`.

---

## CI/CD — GitHub Actions

The pipeline triggers on every push and pull request to `main`/`master`.

### Pipeline steps

1. Checkout code
2. Install Node 20 + npm dependencies
3. Install Chromium with system dependencies
4. Install Xvfb (virtual display for headed Chromium on Linux)
5. Run tests via `xvfb-run` (headed mode avoids Cloudflare bot detection)
6. Upload HTML report as artifact (retained 14 days)
7. Upload JUnit XML + traces as artifact (retained 14 days)
8. Parse JUnit XML and extract pass/fail counts
9. Send email report with summary and run link

### Email report setup

Add the following secrets to your GitHub repository (`Settings → Secrets → Actions`):

| Secret | Value |
|---|---|
| `MAIL_PASSWORD` | Resend API key (starts with `re_`) |
| `MAIL_RECIPIENT` | Email address to receive reports |
| `TEST_PASSWORD` | nopCommerce test account password |

---

## Reporting

| Report type | When generated |
|---|---|
| HTML report | Every run — `playwright-report/index.html` |
| JUnit XML | Every run — `test-results/results.xml` |
| Screenshots | On failure only |
| Video | On failure only |
| Trace | On first retry |

```bash
# Open HTML report locally
npm run report
```

---

## Page Object Structure

Every page file follows this consistent structure:

```ts
export class ExamplePage extends BasePage {

  // ================= LOCATORS =================
  readonly someInput = this.page.locator('#someId');

  // ================= ACTIONS =================
  async doSomething() { ... }

  // ================= ASSERTIONS =================
  async assertSomething() { ... }

}
```

---

## API Validation

Network interception is handled in `utils/networkHelper.ts`:

- `validateSearchAPI` — validates GET /search returns 200
- `validateAddToCartAPI` — validates POST addproducttocart returns 200 with `success: true`
- `validateCheckoutAPI` — validates POST OpcConfirmOrder returns 200 and passes JSON schema validation
# FarbricQAChallenge
