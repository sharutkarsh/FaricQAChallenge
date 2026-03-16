import { faker } from '@faker-js/faker';

export function generateRandomEmail(): string {
  return faker.internet.email({ provider: 'testmail.com' }).toLowerCase();
}
