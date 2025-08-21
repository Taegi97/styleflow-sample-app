// tests/utils/test-helpers.js
import { expect } from '@playwright/test';

export class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  // 공통 로딩 대기
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // 에러 메시지 확인
  async checkForErrors() {
    const errorElements = await this.page.locator('.error, .alert-danger').all();
    if (errorElements.length > 0) {
      const errorText = await errorElements[0].textContent();
      throw new Error(`Page contains error: ${errorText}`);
    }
  }

  // 스크린샷 캡처 (디버깅용)
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  // 성능 메트릭 수집
  async getPerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')?.startTime || 0
      };
    });
    return metrics;
  }
}

// 테스트 데이터 생성기
export const TestData = {
  user: {
    email: 'test@styleflow.com',
    password: 'Test123!',
    name: 'Test User'
  },
  
  product: {
    name: 'Test Product',
    price: '$29.99',
    category: 'shirts'
  }
};
