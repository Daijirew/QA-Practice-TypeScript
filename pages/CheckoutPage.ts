import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly totalPrice: Locator;
  readonly orderCompleteMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.totalPrice = page.locator('.summary_total_label');
    this.orderCompleteMessage = page.locator('.complete-header');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async completeCheckout(firstName: string, lastName: string, zipCode: string) {
    await this.fillCheckoutInfo(firstName, lastName, zipCode);
    await this.clickContinue();
  }

  async getTotalPrice() {
    const totalText = await this.totalPrice.textContent();
    const priceString = totalText?.replace('Total: $', '') || '0';
    return parseFloat(priceString);
  }

  async getItemTotal() {
    const totalText = await this.itemTotal.textContent();
    const priceString = totalText?.replace('Item total: $', '') || '0';
    return parseFloat(priceString);
  }

  async getTax() {
    const taxText = await this.tax.textContent();
    const priceString = taxText?.replace('Tax: $', '') || '0';
    return parseFloat(priceString);
  }

  async isOrderComplete() {
    return await this.orderCompleteMessage.isVisible();
  }

  async getOrderCompleteMessage() {
    return await this.orderCompleteMessage.textContent();
  }
}
