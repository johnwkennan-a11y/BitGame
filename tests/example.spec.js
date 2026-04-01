const { test, expect } = require('@playwright/test');

test.describe('GasBlastron Decoder Tests', () => {
  test('has correct title and splash screen elements', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/GasBlastron Decoder/);

    const splashTitle = page.locator('#splash-screen h1');
    await expect(splashTitle).toHaveText('CRITICAL ALERT');

    const startBtn = page.locator('#btn-start');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveText('START SEQUENCE');
  });

  test('clicking start hides splash and shows game screen', async ({ page }) => {
    await page.goto('/');
    
    const startBtn = page.locator('#btn-start');
    await startBtn.click();

    const splashScreen = page.locator('#splash-screen');
    await expect(splashScreen).toHaveClass(/hidden/);

    const gameScreen = page.locator('#game-screen');
    // Ensure the 'hidden' class is removed from game-screen
    await expect(gameScreen).not.toHaveClass(/hidden/);
    
    // Check that the Hero portal rendered
    await expect(page.locator('#hero-portal')).toBeVisible();
  });
});
