# Playwright POM Test Automation

> 📖 **เอกสารภาษาไทย / Thai Documentation:** 
> - [README_TH.md](../README_TH.md) - เอกสารหลัก
> - [START_HERE_TH.md](../START_HERE_TH.md) - เริ่มใช้งาน
> - [QUICK_REFERENCE_TH.md](../QUICK_REFERENCE_TH.md) - คู่มืออ้างอิงด่วน

## Project Overview
This is a comprehensive test automation suite for https://www.saucedemo.com/ using Playwright with TypeScript and Page Object Model (POM) architecture.

## Key Features
- ✅ Complete POM implementation with 5 page objects
- ✅ 60+ comprehensive test cases
- ✅ Multi-browser support (Chrome, Firefox, Safari, Mobile)
- ✅ Page fixtures for easy access to page objects
- ✅ End-to-end purchase flow testing
- ✅ HTML reports with screenshots and videos
- ✅ TypeScript for type safety

## Quick Start

### Run tests
```bash
npm test                  # Run all tests
npm run test:ui         # Run with UI mode
npm run test:headed     # Run with visible browser
npm run test:debug      # Debug mode
npm run test:report     # View HTML report
```

## Test Structure

### Pages (Page Object Models)
- **LoginPage** - Authentication and login flows
- **ProductsPage** - Product listing and browsing
- **CartPage** - Shopping cart management
- **CheckoutPage** - Checkout process
- **ProductDetailPage** - Individual product details

### Test Suites
- **login.spec.ts** - Login functionality (7 tests)
- **products.spec.ts** - Product page features (14 tests)
- **cart.spec.ts** - Cart operations (10 tests)
- **checkout.spec.ts** - Checkout workflow (10 tests)
- **productDetail.spec.ts** - Product details (9 tests)
- **e2e.spec.ts** - End-to-end flows (4 tests)

### Fixtures
- **pageFixture.ts** - Page object fixtures with proper typing

## Test Credentials
- **Username**: standard_user
- **Password**: secret_sauce

## Configuration
- **Base URL**: https://www.saucedemo.com
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome
- **Reports**: HTML with screenshots and videos
- **Traces**: Enabled on first retry

## Project Completed
✅ All test pages and fixtures created
✅ All test cases implemented
✅ Dependencies installed
✅ Project ready for execution
