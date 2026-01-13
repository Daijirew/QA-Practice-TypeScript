import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('Product Detail Page Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });

  test('should navigate to product detail page', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    const productName = await productDetailPage.getProductName();
    expect(productName).toBeTruthy();
  });

  test('should display product information on detail page', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    const name = await productDetailPage.getProductName();
    const price = await productDetailPage.getProductPrice();
    const description = await productDetailPage.getProductDescription();

    expect(name).toBeTruthy();
    expect(price).toBeGreaterThan(0);
    expect(description).toBeTruthy();
  });

  test('should add product to cart from detail page', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    await productDetailPage.addToCart();
    const badgeValue = await productsPage.getCartBadgeValue();
    expect(badgeValue).toBe('1');
  });

  test('should show remove button after adding to cart', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    await productDetailPage.addToCart();
    const isRemoveVisible = await productDetailPage.isRemoveFromCartButtonVisible();
    expect(isRemoveVisible).toBe(true);
  });

  test('should remove product from detail page', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    await productDetailPage.addToCart();
    await productDetailPage.removeFromCart();
    const isAddToCartVisible = await productDetailPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBe(true);
  });

  test('should go back to products page', async ({ productsPage, productDetailPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    await productDetailPage.goBack();
    await expect(productsPage.productList).toBeVisible();
  });

  test('should navigate to cart from detail page', async ({ productsPage, productDetailPage, cartPage }) => {
    await productsPage.page.locator('.inventory_item_name').first().click();
    await productDetailPage.addToCart();
    await productDetailPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should verify all products have detail pages', async ({ productsPage, productDetailPage }) => {
    const productCount = await productsPage.getProductCount();

    for (let i = 0; i < productCount; i++) {
      await productsPage.page.locator('.inventory_item_name').nth(i).click();
      const productName = await productDetailPage.getProductName();
      expect(productName).toBeTruthy();
      await productDetailPage.goBack();
    }
  });

  test('should display correct price on detail page', async ({ productsPage, productDetailPage }) => {
    // Get first product price from list
    const firstProductElement = await productsPage.page.locator('.inventory_item').first();
    const listPrice = await firstProductElement.locator('.inventory_item_price').textContent();

    // Click on product and verify price
    await productsPage.page.locator('.inventory_item_name').first().click();
    const detailPrice = await productDetailPage.getProductPrice();

    const listPriceValue = parseFloat(listPrice?.replace('$', '') || '0');
    expect(detailPrice).toBe(listPriceValue);
  });
});
