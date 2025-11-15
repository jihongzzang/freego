# 프리고 - 법적 문서

프리고 앱의 개인정보처리방침 및 이용약관 문서입니다.

## 📁 폴더 구조

```text
docs/
├── v1.0/                        # 버전 1.0 (2025-01-15)
│   ├── privacy-policy.html
│   └── terms-of-service.html
├── privacy-policy.html          # 최신 버전 (현재: v1.0)
├── terms-of-service.html        # 최신 버전 (현재: v1.0)
└── README.md
```

## 📄 현재 문서

### 최신 버전: v1.0 (2025-01-15)

- **개인정보처리방침**: [privacy-policy.html](privacy-policy.html)
- **이용약관**: [terms-of-service.html](terms-of-service.html)

## 📋 버전 히스토리

### v1.0 (2025-01-15)

- 최초 작성
- 개인정보 미수집 정책 명시
- 로컬 데이터 저장 방식 설명
- 면책 조항 및 법적 보호 조항 추가

## 🌐 GitHub Pages 배포

### 설정 방법

1. GitHub 저장소 > **Settings** > **Pages**
2. Source: **Deploy from a branch** 선택
3. Branch: **main**, 폴더: **/docs** 선택
4. **Save** 클릭

### 접속 URL

배포 후 다음 URL로 접속 가능합니다:

- 개인정보처리방침: `https://[username].github.io/[repo-name]/privacy-policy.html`
- 이용약관: `https://[username].github.io/[repo-name]/terms-of-service.html`

#### 버전별 URL

- v1.0 개인정보처리방침: `https://[username].github.io/[repo-name]/v1.0/privacy-policy.html`
- v1.0 이용약관: `https://[username].github.io/[repo-name]/v1.0/terms-of-service.html`

## 📱 앱스토어 제출

앱스토어 제출 시 다음 정보를 입력하세요:

- **개인정보처리방침 URL**: 위의 privacy-policy.html URL
- **이용약관 URL**: 위의 terms-of-service.html URL

## 🔄 약관 업데이트 방법

1. **새 버전 폴더 생성**

   ```bash
   mkdir docs/v1.1
   ```

2. **새 버전 파일 작성**

   ```bash
   cp docs/privacy-policy.html docs/v1.1/
   cp docs/terms-of-service.html docs/v1.1/
   # 필요한 수정 작업 수행
   ```

3. **루트 파일 업데이트**

   ```bash
   cp docs/v1.1/privacy-policy.html docs/
   cp docs/v1.1/terms-of-service.html docs/
   ```

4. **README.md의 버전 히스토리 업데이트**

5. **커밋 및 푸시**

   ```bash
   git add docs/
   git commit -m "docs: Update terms to v1.1"
   git push
   ```

## ✅ 체크리스트

- [x] 이메일 주소 확인 (jujihong2@gmail.com)
- [x] 앱 이름 "프리고" 반영
- [x] 최종 업데이트 날짜 확인 (2025년 1월 15일)
- [ ] GitHub Pages 배포 완료
- [ ] 앱스토어에 URL 등록

## 📞 문의

문서 관련 문의: <jujihong2@gmail.com>
