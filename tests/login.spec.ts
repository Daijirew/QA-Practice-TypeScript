import { expect } from '@playwright/test';
import { test } from '../fixtures/pageFixture';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login page elements', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ loginPage, productsPage }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });

  test('should display error message with invalid username', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should display error message with invalid password', async ({ loginPage }) => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should display error message with locked out user', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out');
  });

  test('should login with problem user', async ({ loginPage, productsPage }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });

  test('should login with performance_glitch_user', async ({ loginPage, productsPage }) => {
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(productsPage.productList).toBeVisible();
  });
});
