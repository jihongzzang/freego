/**
 * 법적 문서 URL
 * GitHub Pages 배포 후 username과 repository name을 업데이트하세요
 */

import i18n from '@/locales';

// TODO: GitHub Pages 배포 후 실제 URL로 업데이트
// 예시: https://jihongzzang.github.io/freego/privacy-policy.html
const GITHUB_PAGES_BASE_URL = 'https://jihongzzang.github.io/freego';

/**
 * 현재 언어에 따른 법적 문서 URL 반환
 */
export const getLegalUrls = () => {
  const currentLanguage = i18n.language;
  const isKorean = currentLanguage?.startsWith('ko');

  // 한국어: 기본 경로, 영어: /en 경로
  const basePath = isKorean ? '' : '/en';

  return {
    PRIVACY_POLICY: `${GITHUB_PAGES_BASE_URL}${basePath}/privacy-policy.html`,
    TERMS_OF_SERVICE: `${GITHUB_PAGES_BASE_URL}${basePath}/terms-of-service.html`,
  };
};

// 하위 호환성을 위한 기본 URL (한국어)
export const LEGAL_URLS = {
  PRIVACY_POLICY: `${GITHUB_PAGES_BASE_URL}/privacy-policy.html`,
  TERMS_OF_SERVICE: `${GITHUB_PAGES_BASE_URL}/terms-of-service.html`,
} as const;
