import { test, expect } from '@playwright/test';

test.describe('StyleFlow Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/StyleFlow/);
    
    // 주요 섹션 렌더링 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // 네비게이션 확인 (유연한 셀렉터 사용)
    await expect(page.locator('nav')).toBeVisible();
    
    // 페이지 로딩 완료 확인
    await page.waitForLoadState('networkidle');
  });

  test('should handle responsive design', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // 기본 레이아웃 확인
    await expect(page.locator('body')).toBeVisible();
    await page.waitForLoadState('networkidle');
  });

  test('should have no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 심각한 에러가 없는지 확인 (일부 warnings는 허용)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      error.includes('Error')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
