import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('End-to-End Purchase Flow Tests', () => {
  test('should complete full purchase flow', async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
    // Step 1: Navigate and Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();

    // Step 2: Add products to cart
    const productNames = await productsPage.getAllProductNames();
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await expect(productsPage.cartBadge).toHaveText('2');

    // Step 3: Navigate to cart
    await productsPage.goToCart();
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames.length).toBe(2);

    // Step 4: Verify prices in cart
    const cartPrices = await cartPage.getCartItemPrices();
    cartPrices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
    });

    // Step 5: Proceed to checkout
    await cartPage.checkout();
    await expect(checkoutPage.firstNameInput).toBeVisible();

    // Step 6: Fill checkout info and continue
    await checkoutPage.completeCheckout('John', 'Doe', '12345');

    // Step 7: Verify order summary
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const totalPrice = await checkoutPage.getTotalPrice();

    expect(itemTotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(totalPrice).toBe(parseFloat((itemTotal + tax).toFixed(2)));

    // Step 8: Finish order
    await checkoutPage.clickFinish();
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);
  });

  test('should handle cart updates during shopping', async ({ productsPage, cartPage }) => {
    await productsPage.page.goto('/');
    const loginPage = await import('../pages/LoginPage').then((m) => new m.LoginPage(productsPage.page));
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();

    // Add products
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await expect(productsPage.cartBadge).toHaveText('2');

    // Remove one product
    await productsPage.removeProductFromCart(0);
    let itemCount = (await productsPage.cartBadge.textContent()) || '1';
    expect(itemCount).toBe('1');

    // Go to cart and verify
    await productsPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(1);

    // Continue shopping and add more
    await cartPage.continueShopping();
    await productsPage.addProductToCart(2);
    await expect(productsPage.cartBadge).toHaveText('2');
  });

  test('should verify product availability across pages', async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();

    // Get products from products page
    const productsPageNames = await productsPage.getAllProductNames();
    const productsPagePrices = await productsPage.getAllProductPrices();

    // Add all products to cart
    for (let i = 0; i < productsPageNames.length; i++) {
      await productsPage.addProductToCart(i);
    }

    // Go to cart and verify
    await productsPage.goToCart();
    const cartNames = await cartPage.getCartItemNames();
    const cartPrices = await cartPage.getCartItemPrices();

    expect(cartNames.length).toBe(productsPageNames.length);
    expect(cartPrices.length).toBe(productsPagePrices.length);
  });

  test('should handle multiple checkout scenarios', async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
    const testCases = [
      { firstName: 'User', lastName: 'One', zipCode: '12345', products: [0, 1] },
      { firstName: 'User', lastName: 'Two', zipCode: '54321', products: [2, 3] },
    ];

    for (const testCase of testCases) {
      // Reset for new checkout
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(productsPage.productList).toBeVisible();

      // Add products
      for (const productIndex of testCase.products) {
        await productsPage.addProductToCart(productIndex);
      }

      // Checkout
      await productsPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillCheckoutInfo(testCase.firstName, testCase.lastName, testCase.zipCode);
      await checkoutPage.clickContinue();

      // Verify totals
      const totalPrice = await checkoutPage.getTotalPrice();
      expect(totalPrice).toBeGreaterThan(0);

      // Complete order
      await checkoutPage.clickFinish();
      expect(await checkoutPage.isOrderComplete()).toBe(true);
    }
  });
});
