import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('Checkout Page Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    await cartPage.checkout();
  });

  test('should display checkout page elements', async ({ checkoutPage }) => {
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.zipCodeInput).toBeVisible();
    await expect(checkoutPage.continueButton).toBeVisible();
  });

  test('should fill checkout information', async ({ checkoutPage }) => {
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await expect(checkoutPage.firstNameInput).toHaveValue('John');
    await expect(checkoutPage.lastNameInput).toHaveValue('Doe');
    await expect(checkoutPage.zipCodeInput).toHaveValue('12345');
  });

  test('should continue to checkout review', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    await expect(checkoutPage.finishButton).toBeVisible();
  });

  test('should display item total on review page', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    const itemTotal = await checkoutPage.getItemTotal();
    expect(itemTotal).toBeGreaterThan(0);
  });

  test('should display tax on review page', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    const tax = await checkoutPage.getTax();
    expect(tax).toBeGreaterThanOrEqual(0);
  });

  test('should display total price on review page', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    const totalPrice = await checkoutPage.getTotalPrice();
    expect(totalPrice).toBeGreaterThan(0);
  });

  test('should verify total price calculation (subtotal + tax)', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const totalPrice = await checkoutPage.getTotalPrice();

    const calculatedTotal = parseFloat((itemTotal + tax).toFixed(2));
    expect(totalPrice).toBe(calculatedTotal);
  });

  test('should cancel checkout from step 1', async ({ checkoutPage, productsPage }) => {
    await checkoutPage.clickCancel();
    await expect(productsPage.productList).toBeVisible();
  });

  test('should complete order successfully', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    await checkoutPage.clickFinish();
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);
  });

  test('should display success message after order completion', async ({ checkoutPage }) => {
    await checkoutPage.completeCheckout('John', 'Doe', '12345');
    await checkoutPage.clickFinish();
    const message = await checkoutPage.getOrderCompleteMessage();
    expect(message).toContain('Thank you for your order');
  });

  test('should checkout with different user information', async ({ checkoutPage }) => {
    const testData = [
      { firstName: 'Jane', lastName: 'Smith', zipCode: '54321' },
      { firstName: 'Bob', lastName: 'Johnson', zipCode: '99999' },
      { firstName: 'Alice', lastName: 'Williams', zipCode: '00000' },
    ];

    for (const data of testData) {
      await checkoutPage.fillCheckoutInfo(data.firstName, data.lastName, data.zipCode);
      await expect(checkoutPage.firstNameInput).toHaveValue(data.firstName);
    }
  });
});
