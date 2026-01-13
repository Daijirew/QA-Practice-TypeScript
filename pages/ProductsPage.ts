import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly sortDropdown: Locator;
  readonly hamburgerMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productList = page.locator('.inventory_list');
    this.productItems = page.locator('.inventory_item');
    this.productName = page.locator('.inventory_item_name');
    this.productPrice = page.locator('.inventory_item_price');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('#logout_sidebar_link');
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async getFirstProductName() {
    return await this.productName.first().textContent();
  }

  async addProductToCart(productIndex: number) {
    await this.productItems.nth(productIndex).locator('[data-test="add-to-cart"]').click();
  }

  async removeProductFromCart(productIndex: number) {
    await this.productItems.nth(productIndex).locator('[data-test="remove"]').click();
  }

  async getCartBadgeValue() {
    return await this.cartBadge.textContent();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async sortProducts(sortOption: string) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async openHamburgerMenu() {
    await this.hamburgerMenu.click();
  }

  async logout() {
    await this.openHamburgerMenu();
    await this.page.waitForTimeout(500);
    await this.logoutButton.click();
  }

  async getAllProductPrices() {
    const prices = await this.productPrice.allTextContents();
    return prices.map((price) => parseFloat(price.replace('$', '')));
  }

  async getAllProductNames() {
    return await this.productName.allTextContents();
  }
}
