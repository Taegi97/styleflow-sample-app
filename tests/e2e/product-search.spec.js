import { test, expect } from '@playwright/test';

test.describe('Product Features', () => {
  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 기본 네비게이션 테스트
    const links = await page.locator('a[href]').all();
    expect(links.length).toBeGreaterThan(0);
    
    // 첫 번째 링크 클릭 테스트
    if (links.length > 0) {
      const firstLink = links[0];
      const href = await firstLink.getAttribute('href');
      
      if (href && href.startsWith('/')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should handle search functionality if available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 검색 입력 필드 찾기
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    } else {
      console.log('Search functionality not found - skipping search test');
    }
  });
});
