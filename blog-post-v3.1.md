# VS Code Extension "Beom Header" v3.1 업데이트 - 고급 언어 확장자 매핑 시스템 도입

안녕하세요! 오늘은 VS Code 확장 프로그램 "Beom Header"의 메이저 업데이트 v3.1에 대해 소개해드리려고 합니다. 이번 업데이트는 특히 다국어 개발 환경에서의 사용성을 크게 개선했습니다.

## 🔥 주요 업데이트 하이라이트

### 1. 🌍 고급 언어 확장자 매핑 시스템

이번 업데이트의 가장 큰 변화입니다! 기존에는 하나의 언어가 하나의 파일 확장자만 지원했다면, 이제는 **다중 확장자를 지원**합니다.

**기존 방식:**
```json
{
  "typescript": ".ts",
  "javascript": ".js"
}
```

**새로운 방식:**
```json
{
  "typescript": [".ts", ".tsx", ".mts", ".cts"],
  "javascript": [".js", ".jsx", ".mjs", ".cjs"],
  "python": [".py", ".pyx", ".pyi"]
}
```

### 2. 📋 투명한 기본값 시스템

가장 혁신적인 변화는 **50+ 기본 언어 매핑이 이제 사용자에게 완전히 노출**된다는 점입니다!

![VS Code 설정에서 기본 언어 매핑 확인](https://via.placeholder.com/600x300/4CAF50/FFFFFF?text=VS+Code+%EC%84%A4%EC%A0%95%EC%97%90%EC%84%9C+%EA%B8%B0%EB%B3%B8+%EC%96%B8%EC%96%B4+%EB%A7%A4%ED%95%91+%ED%99%95%EC%9D%B8)

**이제 사용자들이 할 수 있는 것들:**
- ✅ 어떤 언어들이 기본으로 지원되는지 확인
- ✅ 기본 매핑을 쉽게 커스터마이징
- ✅ 새로운 언어 추가
- ✅ 덮어쓴 설정을 기본값으로 복원

## 🛠️ 새로운 관리 명령어들

### 📝 언어 확장자 매핑 목록 보기
Command Palette → "List Language Extension Mappings"

이제 다음과 같이 카테고리별로 표시됩니다:

```
📝 기본 매핑:
  typescript → .ts, .tsx, .mts, .cts
  javascript → .js, .jsx, .mjs, .cjs
  python → .py, .pyx, .pyi

✏️ 사용자 커스텀:
  mylang → .custom, .special

🔄 덮어쓴 기본값:
  ~~typescript → .ts, .tsx~~ → .ts, .tsx, .vue
```

### ➕ 언어 확장자 매핑 추가
Command Palette → "Add Language Extension Mapping"

**스마트한 기본값 감지:**
- 기존 기본값이 있는 언어를 수정할 때 명확한 안내
- 새로운 언어 추가 시 단계별 가이드

### 🗑️ 언어 확장자 매핑 제거/복원
Command Palette → "Remove Language Extension Mapping"

**똑똑한 복원 시스템:**
- 커스텀 언어: 완전 제거
- 덮어쓴 기본값: 기본값으로 자동 복원
- 복원될 내용 미리보기 제공

## 🌐 지원하는 언어들 (50+)

이번 업데이트로 지원하는 언어가 대폭 확장되었습니다:

| 언어 | 확장자 |
|------|--------|
| TypeScript | `.ts`, `.tsx`, `.mts`, `.cts` |
| JavaScript | `.js`, `.jsx`, `.mjs`, `.cjs` |
| Python | `.py`, `.pyx`, `.pyi` |
| Java | `.java` |
| C# | `.cs` |
| C++ | `.cpp`, `.cc`, `.cxx` |
| Go | `.go` |
| Rust | `.rs` |
| Swift | `.swift` |
| Kotlin | `.kt`, `.kts` |
| PHP | `.php`, `.phtml` |
| Ruby | `.rb`, `.rbw` |
| Shell | `.sh`, `.bash`, `.zsh` |
| PowerShell | `.ps1`, `.psm1` |
| YAML | `.yml`, `.yaml` |
| JSON | `.json`, `.jsonc` |
| ... 그리고 30+ 추가 언어들! |

## 💡 실제 사용 예시

### 시나리오 1: React 프로젝트에서 TypeScript 사용
```
기본값: typescript → [".ts", ".tsx", ".mts", ".cts"]
```
→ `.tsx` 파일에서도 자동으로 TypeScript 헤더가 삽입됩니다!

### 시나리오 2: Node.js 프로젝트의 다양한 JavaScript 파일
```
기본값: javascript → [".js", ".jsx", ".mjs", ".cjs"]
```
→ ES6 모듈(`.mjs`)이나 CommonJS(`.cjs`) 파일 모두 지원!

### 시나리오 3: 새로운 언어 추가
```
Command: "Add Language Extension Mapping"
Language ID: "vue"
Extensions: ".vue"
```
→ Vue.js 파일에 커스텀 헤더 삽입 가능!

## 🔧 기술적 개선사항

### 타입 안전성 강화
```typescript
// 기존
Record<string, string>

// 새로운 방식
Record<string, string[]>
```

### 스마트한 오버라이드 감지
- 기본값과 사용자 설정을 지능적으로 구분
- 시각적으로 명확한 표시 (~~취소선~~ 등)

### 성능 최적화
- 효율적인 언어 확장자 검색
- 최적화된 기본값/사용자 설정 우선순위 처리

## 🎯 사용자 경험 개선

### Before (v3.0)
```
❌ 기본 매핑이 코드에 숨겨져 있음
❌ TypeScript = .ts만 지원
❌ 사용자가 어떤 언어가 지원되는지 모름
❌ 덮어쓴 설정 복원이 어려움
```

### After (v3.1)
```
✅ 모든 기본 매핑이 설정에서 확인 가능
✅ TypeScript = .ts, .tsx, .mts, .cts 모두 지원
✅ 50+ 언어 매핑이 투명하게 공개
✅ 원클릭으로 기본값 복원 가능
```

## 🚀 설치 및 사용법

### 1. 설치
VS Code 확장 마켓플레이스에서 "Beom Header" 검색 후 설치

### 2. 기본 사용법
```
Ctrl+Shift+P → "Insert File Header"
```

### 3. 언어 매핑 확인
```
Ctrl+Shift+P → "List Language Extension Mappings"
```

### 4. 커스텀 언어 추가
```
Ctrl+Shift+P → "Add Language Extension Mapping"
```

## 📈 개발자를 위한 팁

### 팀 프로젝트에서 설정 공유
```json
// .vscode/settings.json
{
  "beomHeader.languageExtensions": {
    "typescript": [".ts", ".tsx", ".vue"],
    "customlang": [".custom", ".special"]
  }
}
```

### 다국어 프로젝트 대응
한 프로젝트에서 여러 언어를 사용할 때, 각 언어별로 적절한 헤더가 자동 삽입됩니다:

- `.py` 파일 → Python 스타일 헤더 (`#`)
- `.js` 파일 → JavaScript 스타일 헤더 (`//`)
- `.sh` 파일 → Shell 스크립트 헤더 (`#`)

## 🔮 앞으로의 계획

- 더 많은 언어 지원 추가
- AI 기반 헤더 내용 자동 생성
- 팀별 헤더 템플릿 공유 기능
- 프로젝트별 자동 설정 감지

## 🎉 마무리

Beom Header v3.1은 다국어 개발 환경에서의 생산성을 크게 향상시키는 업데이트입니다. 특히 **투명한 기본값 시스템**과 **다중 확장자 지원**으로 개발자들이 더욱 편리하게 파일 헤더를 관리할 수 있게 되었습니다.

여러분의 개발 워크플로우에 도움이 되기를 바라며, 피드백이나 제안사항이 있으시면 언제든지 GitHub 이슈로 남겨주세요!

---

**다운로드:** [VS Code 마켓플레이스](https://marketplace.visualstudio.com/)
**GitHub:** [beom-git/BeomHeader](https://github.com/beom-git/BeomHeader)
**버전:** v3.1.0
**업데이트 날짜:** 2025년 9월 8일

#VSCode #확장프로그램 #개발도구 #BeomHeader #TypeScript #JavaScript #Python #다국어개발
