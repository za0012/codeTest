# 개선 기록

## 들어가기 전

해당 프로젝트는 ai를 통해 틀을 잡은 후 직접 코드 리팩토링 및 개선시키는 작업을 진행중입니다.

## 일지

### 2026.04.06 ~ 2026.04.07

react 프로젝트 생성 후 해당 프로젝트 소스를 넣고 node_modules를 설치하는 작업을 진행했다.

pnpm i 하는 과정 중에 package들이 너무 많아 중간중간 오류가 계속 생겨서 node_modules, lock파일을 삭제하고 설치하는 작업을 반복했다.

#### 패키지

- eslint & biome
eslint패키지가 기본적으로 깔려있어서 해당 패키지들 및 파일들을 삭제 후 biome으로 마이그레이션 진행해주었다.

eslint는 오랫동안 사용되어온 만큼 생태계도 다양하고 예시가 많다는 장점이 있지만, eslint와 prettier 둘 다 셋업하기 불편해서 biome으로 설정해주었다.

biome은 biome init을 하면 파일 하나가 생기는데, 해당 파일로 lint와 prettier 설정 둘 다 할 수 있다. 해당 부분이 굉장히 편하다고 생각해 설치해주었다.
기존에 eslint를 설정해주었을 때 설치해야하는 파일도 많았고 해당 과정 중에서 오류가 많이 났기 때문에...

- tailwind
내가 참 애용하는 패키지이다. className만 적어주면 스타일링이 되기 때문이다.
v4로 올라가면서 설정도 간편해졌다. 허나 코드의 class가 굉장히 더러워진다는 단점이 있기 때문에 추후 scss파일로의 분리를 고민해봐야 할 것 같다.

- tanstack router로 변경
기존에는 app router 형식으로 돼있었다. 허나 폴더 라우터가 편리하고 유지보수에도 괜찮다고 생각해, tanstack router로 마이그레이션 진행해주었다.

vite.config 파일에 tanstackRouter()추가, 기존 router 파일 삭제.

```ts
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // 자동 생성 파일
import "./styles/index.css";

const router = createRouter({ routeTree });

// 타입 등록
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
import { Outlet, createRootRoute, NavLink } from "@tanstack/react-router";
import { StudyProvider, useStudy } from "../context/StudyContext";

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

해당 코드 추가 후 pnpm dev 하면 된다.
+) 라우터 선언 파일까지 추가 해주어야한다.
그리고 하단에 사이드바 컴포넌트 선언 후 안에 넣어주었다. 추후 분리 요망.

#### 코드

- 대시보드 폴더 생성 후 달력과 피드 컴포넌트로 분리
기존에 한 줄로 돼있던 코드를 컴포넌트로 분리해주었다.
캘린더, 피드 이렇게 2개로 나누었다. 아직 그렇게 크게 바뀐 부분은 없다.
props 추가, 함수 분리정도.

- 변경한 대시보드 적용 및 마이페이지, 문제풀이 폴더 분리
- 문제풀이 모달 분리
문제풀이... 코드만 700줄인가 그 이상이었던 것 같다.
우선 모달을 컴포넌트로 분리 후 잠시 여흥을 위해 스크롤바 없애는 css코드를 추가해주었다.

### 2026.04.08

일반 form을 react-hook-form으로 교체하는 작업을 진행하였다.
우선 violet보단 blue가 좀 더 보기 편할 것 같아 색상 교체 및 필요없는 스타일 제거를 진행하였다.
이후 테스트용 페이지 추가 및 셀렉트 커스텀 컴포넌트를 추가하였다. 기존에 있던 select 컴포넌트를 새파일에 커스텀하여 해당 컴포넌트를 메인으로 사용하는 것.

사용하지 않는 컴포넌트 제거 및 라이브러리 제거 후 코드 하이라이터 라이브러리를 추가하여 문제보기에 있는 모달에 적용해주었다.

### 2026.04.09

일반 form을 react-hook-form으로 교체하는 작업을 진행하였다.
css작업도 진행하였다.

일반 form에서 react-hook-form으로 교체하면서 onChange같이 각 폼들의 상태를 받아 state로 올려보내주는 작업이 필요없게 되었다.

또한 각 폼의 상태를 저장할 변수들도 필요가 없어졌다.
셀렉트나 태그같이 값을 여러 개 가져오는 커스텀 컴포넌트는 Controller로, input같은 간단한 컴포넌트들은 regist로 관리해주었다.

폼 안에서 반복되는 부분들도 내부 컴포넌트로 변경
사용하지 않는 함수, 주석 삭제해주었다.

useForm의 control로 Controller관리, watch로 태그 선택, 플랫폼 선택을 제어하였다.
setValue와 watch를 조합해서 사용하였는데, onClick시 watch로 데이터를 받아와 일치, 불일지 체크로 setValue로 watch하고 있는 값을 변경한다거나...
값을 가져온 후 setValue로 radio처럼 바꿔주는 것처럼.

onSubmit와 handleSubmit으로 폼 제출 관리,
controler 와 register으로는 폼의 값을 넣어주는 작업을 하였다.
