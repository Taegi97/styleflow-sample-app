import { test, expect } from '@playwright/test';

test.describe('User Interactions', () => {
  test('should handle basic user interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 클릭 가능한 요소들 확인
    const buttons = await page.locator('button, a, input[type="submit"]').all();
    expect(buttons.length).toBeGreaterThan(0);
    
    // 첫 번째 버튼이 있다면 호버 테스트
    if (buttons.length > 0) {
      await buttons[0].hover();
      await expect(buttons).toBeVisible();
    }
  });

  test('should handle form interactions if available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 폼 요소들 확인
    const forms = await page.locator('form').all();
    const inputs = await page.locator('input:not([type="hidden"])').all();
    
    if (inputs.length > 0) {
      const firstInput = inputs[0];
      if (await firstInput.isVisible() && await firstInput.isEnabled()) {
        await firstInput.fill('test value');
        await expect(firstInput).toHaveValue('test value');
      }
    }
  });

  test('should load without critical JavaScript errors', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // JavaScript 에러가 없는지 확인
    expect(jsErrors.filter(error => 
      !error.includes('Non-Error promise rejection') &&
      !error.includes('ResizeObserver')
    )).toHaveLength(0);
  });
});
