import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('Products Page Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });

  test('should display products list', async ({ productsPage }) => {
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should display 6 products', async ({ productsPage }) => {
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6);
  });

  test('should get first product name', async ({ productsPage }) => {
    const productName = await productsPage.getFirstProductName();
    expect(productName).toBeTruthy();
    expect(productName?.length).toBeGreaterThan(0);
  });

  test('should add product to cart', async ({ productsPage }) => {
    await productsPage.addProductToCart(0);
    const badgeValue = await productsPage.getCartBadgeValue();
    expect(badgeValue).toBe('1');
  });

  test('should add multiple products to cart', async ({ productsPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    const badgeValue = await productsPage.getCartBadgeValue();
    expect(badgeValue).toBe('3');
  });

  test('should remove product from cart', async ({ productsPage }) => {
    await productsPage.addProductToCart(0);
    let badgeValue = await productsPage.getCartBadgeValue();
    expect(badgeValue).toBe('1');

    await productsPage.removeProductFromCart(0);
    const cartBadgeExists = await productsPage.cartBadge.isVisible().catch(() => false);
    expect(cartBadgeExists).toBe(false);
  });

  test('should navigate to cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should get all product prices', async ({ productsPage }) => {
    const prices = await productsPage.getAllProductPrices();
    expect(prices.length).toBe(6);
    prices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
    });
  });

  test('should get all product names', async ({ productsPage }) => {
    const names = await productsPage.getAllProductNames();
    expect(names.length).toBe(6);
    names.forEach((name) => {
      expect(name?.length).toBeGreaterThan(0);
    });
  });

  test('should sort products by name (A to Z)', async ({ productsPage }) => {
    await productsPage.sortProducts('az');
    const names = await productsPage.getAllProductNames();
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  test('should sort products by name (Z to A)', async ({ productsPage }) => {
    await productsPage.sortProducts('za');
    const names = await productsPage.getAllProductNames();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  test('should sort products by price (low to high)', async ({ productsPage }) => {
    await productsPage.sortProducts('lohi');
    const prices = await productsPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('should sort products by price (high to low)', async ({ productsPage }) => {
    await productsPage.sortProducts('hilo');
    const prices = await productsPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('should logout from hamburger menu', async ({ loginPage, productsPage }) => {
    await productsPage.logout();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
