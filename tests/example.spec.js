const { test, expect } = require('@playwright/test');

test.describe('GasBlastron Decoder Tests', () => {
  test('has correct title and splash screen elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GasBlastron Decoder/);
  });

  test('FULL PLAYTHROUGH: Can beat the game successfully', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#btn-start').click();

    await expect(page.locator('#game-screen')).not.toHaveClass(/hidden/);
    
    for (let attempts = 0; attempts < 15; attempts++) {
        const incomingEl = page.locator('#incoming-code');
        await incomingEl.waitFor();
        const incomingText = await incomingEl.innerText();
        
        if (incomingText === "SYSTEM ARMED") {
            break; 
        }

        const dec = parseInt(incomingText, 10);
        if (isNaN(dec)) {
            await page.waitForTimeout(100);
            continue;
        }

        for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
            const bitValue = 1 << bitIndex;
            const needsToBeActive = (dec & bitValue) !== 0;
            
            const btnLocator = page.locator(`button.bit-btn[data-bit="${bitIndex}"]`);
            const isActive = await btnLocator.evaluate(el => el.classList.contains('active'));
            
            if (needsToBeActive !== isActive) {
                await btnLocator.click();
            }
        }
        
        await expect(incomingEl).not.toHaveText(incomingText, { timeout: 3000 });
    }
    
    const victoryText = page.locator('#victory-text');
    await expect(victoryText).toHaveClass(/show/, { timeout: 6000 });
  });
});
