import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly backButton: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productPrice = page.locator('.inventory_details_price');
    this.productDescription = page.locator('.inventory_details_desc');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeFromCartButton = page.locator('[data-test="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async getProductName() {
    return await this.productName.textContent();
  }

  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText?.replace('$', '') || '0');
  }

  async getProductDescription() {
    return await this.productDescription.textContent();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeFromCartButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async isAddToCartButtonVisible() {
    return await this.addToCartButton.isVisible();
  }

  async isRemoveFromCartButtonVisible() {
    return await this.removeFromCartButton.isVisible();
  }
}
