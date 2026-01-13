import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('Cart Page Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });

  test('should display empty cart message', async ({ cartPage }) => {
    await cartPage.cartIcon.click();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('should add item to cart and verify in cart page', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should add multiple items to cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await productsPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(3);
  });

  test('should get cart item names', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames.length).toBe(2);
    itemNames.forEach((name) => {
      expect(name).toBeTruthy();
    });
  });

  test('should get cart item prices', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    const prices = await cartPage.getCartItemPrices();
    expect(prices.length).toBe(2);
    prices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
    });
  });

  test('should remove item from cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    await cartPage.removeCartItem(0);
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should continue shopping from cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    await cartPage.continueShopping();
    await expect(productsPage.productList).toBeVisible();
  });

  test('should calculate total price correctly', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.goToCart();
    const totalPrice = await cartPage.getTotalPrice();
    expect(totalPrice).toBeGreaterThan(0);
  });

  test('should proceed to checkout from cart', async ({ productsPage, cartPage, checkoutPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    await cartPage.checkout();
    await expect(checkoutPage.firstNameInput).toBeVisible();
  });

  test('should clear all items from cart', async ({ productsPage, cartPage }) => {
    await productsPage.addProductToCart(0);
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await productsPage.goToCart();

    // Remove all items
    await cartPage.removeCartItem(0);
    await cartPage.removeCartItem(0);
    await cartPage.removeCartItem(0);

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });
});
