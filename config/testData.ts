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

  api: {
    searchEndpoint:       '/search',
    addToCartEndpoint:    'addproducttocart',
    billingEndpoint:      'OpcSaveBilling',
    confirmOrderEndpoint: 'OpcConfirmOrder',
    checkoutCompletedUrl: '/checkout/completed',
    statesEndpoint:       'getstatesbycountryid',
    orderEndpoint:        '/order',
    checkoutSchemaName:   'checkoutSchema',
    successStatus:        200,
    serverErrorThreshold: 500,
    contentTypeHtml:      'text/html',
  },

  expected: {
    registrationSuccess: 'Your registration completed',
    addToCartSuccess:    'added to your',
    orderStatus:         'Pending',
    homeUrlPattern:      /demo\.nopcommerce\.com/,
    headerSelector:      '.header',
    loginTimeout:        30000,
  },

};
