# 개선 기록

## 개요

AI를 통해 초기 코드 구조를 생성한 후, 직접 리팩토링 및 점진적 개선을 진행 중인 프로젝트입니다.

---

## 2026.04.06 ~ 2026.04.07

### 환경 구성

React 프로젝트 생성 및 기존 소스 코드 이전 후 패키지 설치를 진행했습니다.

`pnpm i` 실행 중 의존성 충돌로 인한 설치 오류가 반복 발생하여, `node_modules` 디렉토리와 lock 파일을 삭제 후 재설치하는 과정을 반복했습니다.

### 패키지 변경 사항

#### ESLint → Biome

기본 설치된 ESLint 및 관련 설정 파일을 제거하고 Biome으로 마이그레이션했습니다.

| 항목 | ESLint + Prettier | Biome |
|------|------------------|-------|
| 설정 파일 | 복수의 설정 파일 필요 | `biome.json` 단일 파일 |
| lint + format | 별도 패키지 구성 필요 | 통합 제공 |
| 초기 설정 | 복잡, 오류 발생 빈번 | `biome init` 한 번으로 완료 |

Biome은 lint와 포맷팅을 단일 설정 파일(`biome.json`)로 관리할 수 있어 초기 설정 부담이 적습니다.

#### Tailwind CSS v4

`className` 기반 유틸리티 스타일링 도구입니다. v4에서 설정 방식이 간소화되었습니다.

> **TODO**: 클래스 가독성 저하 문제로 인해 추후 SCSS 파일로의 분리를 검토할 예정입니다.

#### App Router → TanStack Router

폴더 기반 파일 라우팅의 유지보수성을 고려하여 TanStack Router로 마이그레이션했습니다.

**변경 사항**

- `vite.config`에 `tanstackRouter()` 플러그인 추가
- 기존 라우터 파일 삭제
- `routeTree.gen.ts` 자동 생성 파일 기반으로 라우터 초기화

```ts
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles/index.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

```ts
// src/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { StudyProvider } from "../context/StudyContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <StudyProvider>
      <div className="flex min-h-screen bg-gray-50/50">
        <SidebarInner />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </StudyProvider>
  );
}
```

> **NOTE**: 루트 라우트 선언 파일(`__root.tsx`)을 반드시 추가해야 합니다. 사이드바 컴포넌트는 현재 루트에 인라인 선언되어 있으며, 추후 별도 파일로 분리할 예정입니다.

### 컴포넌트 구조 개선

- 대시보드를 `Calendar`, `Feed` 컴포넌트로 분리. props 정의 및 내부 함수 분리 적용.
- 마이페이지, 문제풀이 폴더 구조 분리 및 개선된 대시보드 반영.
- 700줄 이상이었던 문제풀이 컴포넌트에서 모달을 별도 컴포넌트로 분리. 스크롤바 숨김 CSS 추가.

---

## 2026.04.08

### 스타일 및 컴포넌트 정비

- 색상 테마 변경: `violet` → `blue`
- 불필요한 스타일 및 미사용 컴포넌트, 라이브러리 제거
- 테스트 페이지 추가
- 커스텀 `Select` 컴포넌트 신규 파일로 분리 및 적용
- 코드 하이라이터 라이브러리 추가 → 문제 보기 모달에 적용

---

## 2026.04.09

### React Hook Form 마이그레이션

일반 HTML `form`을 `react-hook-form` 기반으로 전환했습니다.

**주요 변경 사항**

기존에는 각 폼 필드마다 `onChange` 핸들러를 통해 상태를 상위 컴포넌트로 끌어올리고, 별도의 상태 변수를 선언해야 했습니다. `react-hook-form` 전환 후 이 과정이 불필요해졌습니다.

| 항목 | 기존 방식 | react-hook-form |
|------|-----------|-----------------|
| 상태 관리 | `useState` + `onChange` | `register` / `Controller` |
| 폼 제출 | 직접 핸들링 | `handleSubmit` + `onSubmit` |
| 커스텀 컴포넌트 | props 수동 연결 | `Controller`로 통합 |

**구현 방식**

- 일반 `input` 요소: `register`로 등록
- 커스텀 컴포넌트(Select, 태그 등): `Controller`로 감싸 `control` 주입
- 다중 선택 UI: `watch` + `setValue` 조합으로 라디오 버튼과 유사하게 구현
  - `onClick` 시 `watch`로 현재 값 조회 → 일치 여부에 따라 `setValue`로 업데이트
- 폼 제출: `handleSubmit(onSubmit)` 패턴으로 처리

**기타**

- 폼 내부 반복 코드를 내부 컴포넌트로 추출
- 미사용 함수 및 주석 제거
- CSS 스타일 작업 병행