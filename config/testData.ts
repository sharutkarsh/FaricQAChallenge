export const testData = {

  baseUrl: 'https://demo.nopcommerce.com',

  user: {
    firstName: 'Test',
    lastName: 'User',
    password: process.env.TEST_PASSWORD ?? 'Password123!',
  },

  billing: {
    country: 'United States of America',
    state: 'Alabama',
    city: 'Jaipur',
    address: 'Jaipur',
    zip: '32001',
    phone: '9999999999',
  },

  product: {
    searchTerm: 'Asus Laptop',
  },

};
