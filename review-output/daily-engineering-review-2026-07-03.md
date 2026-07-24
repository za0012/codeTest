# codeTest 일간 프로젝트 모니터

점검 시각: 2026-07-03 09:06 KST  
이전 자동화 기준: 2026-07-02 09:02 KST 메모  
브랜치: `codex-automated-review-pipeline`  
기준 범위: `ad3850b..HEAD` 신규 커밋 2개와 현재 작업 트리 diff

## 1) 요약

- 2026-07-02 15:08, 16:09 KST에 자동 코드 리뷰 파이프라인 커밋 2개가 추가됐다. 주요 변경은 `.github/workflows/automated-code-review.yml`, `.github/workflows/scheduled-study-report.yml`, `scripts/review-harness.ts`, `review-agents/*.md`, `docs/automated-code-review.md`, `package.json`의 `review` 스크립트다.
- 현재 작업 트리에는 여전히 `README.md`, `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts`, `src/app/(without-sidebar)/login/page.tsx` 3개 파일의 미커밋 변경이 있다. 이 중 `AccountSetting/service.ts`와 `login/page.tsx`는 실제 앱 품질과 보안/노출 리스크가 있다.
- 가장 먼저 볼 리스크는 PR 워크플로가 PR 브랜치의 코드를 `OPENAI_API_KEY`, `NOTION_TOKEN`, `GITHUB_TOKEN` 환경과 함께 실행하는 구조다. 같은 저장소 브랜치 PR이나 권한 있는 기여자가 악성 변경을 넣으면 secrets 노출 위험이 생긴다.
- 빌드와 타입 검증은 통과하지 못했다. 기존 타입 오류가 다수 있고, 미커밋 변경으로 `AccountSetting/service.ts:43`의 암시적 `any` 오류가 새로 추가됐다.
- 의존성 자체는 바뀌지 않았다. `package.json`에는 `review` 스크립트만 추가됐고, `bun.lock` 변경은 없다.

## 2) 변경 사항

### 신규 커밋

- `7b4bb77` (2026-07-02 15:08:14 KST): 자동 코드 리뷰 파이프라인 추가
- `1cc41fb` (2026-07-02 16:09:18 KST): 자동 코드 리뷰 파이프라인 보완

커밋 diff 요약:

- `.github/workflows/automated-code-review.yml`: PR 이벤트에서 Bun 설치 후 `bun run review -- --fail-on P1` 실행, PR 코멘트 및 선택적 Notion 저장 환경변수 주입
- `.github/workflows/scheduled-study-report.yml`: 매일 23:00 UTC, 금요일 23:30 UTC 예약 실행 및 Notion 저장
- `scripts/review-harness.ts`: diff 수집, lint/typecheck/test/build 실행, OpenAI Responses API 호출, findings 정규화, Notion/GitHub 코멘트 출력
- `review-agents/*.md`: architecture/bug/performance/reporter/security 역할 프롬프트 추가 또는 보강
- `docs/automated-code-review.md`: 파이프라인 사용 문서 추가
- `package.json`: `"review": "bun scripts/review-harness.ts"` 추가
- `.gitignore`: `/review-output` 추가

### 현재 작업 트리 변경

- `README.md`: 히트맵 구현 메모, Biome children prop 오류 메모, React Query `invalidateQueries` 스냅샷 이슈 설명 추가
- `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts`: 계정 설정 서비스 파일에 알고리즘 풀이용 `solution2`, `solution` 함수와 디버그 로그가 추가됨
- `src/app/(without-sidebar)/login/page.tsx`: 로그인 성공 후 `console.log(study)` 추가, catch 인자 제거, 로그인 화면 하단에 `ddong@jj.com || ddong!` 텍스트 추가

### TODO/FIXME/보안 키워드

- `TODO`, `FIXME`, `HACK`, `XXX` 신규 항목은 발견되지 않았다.
- 보안 키워드 스캔에서 신규 파이프라인의 `OPENAI_API_KEY`, `NOTION_TOKEN`, `GITHUB_TOKEN` 사용과 기존 로그인/확장 API 인증 코드가 확인됐다. 토큰 값이 코드에 직접 들어간 것은 없지만, PR 워크플로 실행 구조는 별도 보안 리스크다.

## 3) 테스트/빌드 결과

- `bun.cmd run review -- --skip-checks --skip-agents --base ad3850b --head HEAD --json-out review-output/daily-dry-run.json --markdown-out review-output/daily-dry-run.md`
  - 샌드박스 실행: 실패, `EPERM: operation not permitted, uv_spawn 'git'`
  - 외부 권한 재실행: 성공. 변경 파일 11개, 드라이런 findings 0개. 샌드박스 제한과 실제 스크립트 실패를 분리 확인했다.
- `bun.cmd test ./src/**/*.test.ts`
  - 실패. `Test filter "./src/**/*.test.ts" had no matches`
  - 테스트 파일이 없어 검증이 실패하는 상태다. 이 실패는 기존 상태로 보인다.
- `bun.cmd biome check .`
  - 실패. 69 errors, 32 warnings.
  - 예: `src/app/(with-sidebar)/mypage/components/BarChart/view.tsx` unused import/unused variable, `src/util/hook/useDeleteBanner.tsx` unused variable, 다수 파일 포맷팅 차이.
- `bunx.cmd tsc --noEmit --pretty false`
  - 실패. 주요 오류:
  - `src/app/(with-sidebar)/problems/components/problem-add/TagSection.tsx:83` `tag` 암시적 `any`
  - `src/app/(with-sidebar)/problems/page.tsx:135` `any[] | undefined`를 `string[]`에 할당
  - `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts:43` `arr1`, `arr2` 암시적 `any` 신규 오류
  - `src/app/(without-sidebar)/find/page.tsx:7` `MakeStudy.tsx`가 module 아님
  - `src/components/Sidebar.tsx:49` `study` possibly undefined
  - `src/components/ui/calendar.tsx:94` `table` className key 타입 불일치
  - `src/lib/store/studyStore.ts:6-11` `null`이 string/number 타입에 할당됨
- `bun.cmd next build`
  - 샌드박스 실행: 컴파일 성공 후 TypeScript 단계에서 `spawn EPERM`
  - 외부 권한 재실행: 컴파일 성공 후 타입 체크 실패. 첫 차단 오류는 `src/app/(with-sidebar)/problems/components/problem-add/TagSection.tsx:83` 암시적 `any`.
- `git diff --check`
  - exit code 0. 공백 오류 없음.
  - `AccountSetting/service.ts`, `login/page.tsx`에 LF가 CRLF로 바뀔 수 있다는 경고는 있음.
- `actionlint`
  - 로컬에 설치되어 있지 않아 워크플로 문법 검증은 수행하지 못했다.

## 4) 코드 개선점 및 리뷰 메모

### 중복과 큰 단위

- `scripts/review-harness.ts`는 diff 수집, 검증 명령 실행, OpenAI 호출, findings 정규화, Markdown 렌더링, Notion 저장, GitHub 코멘트까지 한 파일에서 모두 처리한다. 자동화 스크립트로는 시작 가능한 구조지만, 유지보수 관점에서는 책임이 커졌다.
- 추천 분리:
  - `collectReviewContext.ts`: base/head, diff, changed files
  - `runChecks.ts`: lint/typecheck/test/build 실행과 결과 정규화
  - `openaiReview.ts`: Responses API 호출과 JSON 파싱
  - `publishers/notion.ts`, `publishers/github.ts`: 외부 저장/코멘트
  - `renderReport.ts`: Markdown/GitHub comment 렌더링
- `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts`는 계정/스터디 탈퇴 API 서비스 파일인데, 알고리즘 풀이 함수가 섞였다. 이 파일은 Supabase 계정 관련 remote mutation만 담당해야 한다.

### SRP / 단일 책임

- `AccountSetting/service.ts:26-56`의 `solution2`, `solution`은 서비스 책임과 무관하다. 이 때문에 실제 제품 코드 타입 체크가 알고리즘 연습 코드 때문에 실패한다.
  - 수정 제안: 풀이 실험 코드는 커밋 대상에서 제거하거나 `scratch/`처럼 빌드 제외된 위치로 옮긴다. 제품 코드에는 `leaveStudy`만 남긴다.
- `.github/workflows/automated-code-review.yml:28-43`은 PR 검증, LLM 호출, GitHub 코멘트, 선택적 Notion 저장을 한 job에서 처리한다. 보안 경계를 고려하면 “untrusted PR code 실행”과 “secrets가 필요한 publish”를 분리해야 한다.
  - 수정 제안: PR에서는 secrets 없이 정적 검증/아티팩트 생성만 수행하고, secrets가 필요한 LLM/Notion/GitHub publish는 신뢰된 base workflow 또는 별도 승인된 job에서 실행한다.

### 타입 안정성

- 신규 미커밋 변경: `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts:43`
  - `function solution(arr1, arr2)`의 `arr1`, `arr2`가 암시적 `any`다. `strict` 프로젝트에서는 즉시 빌드 실패 요인이다.
  - 행렬 곱 함수가 필요하다면 `function multiplyMatrices(leftMatrix: number[][], rightMatrix: number[][]): number[][]`처럼 입력/반환 타입과 도메인 의미를 드러내야 한다.
- 기존 실패: `TagSection.tsx:11`의 `selectedTags`가 `useWatch`에서 `unknown/any` 흐름으로 내려와 `selectedTags.map((tag) => ...)`에서 `tag`가 `any`가 된다.
  - 수정 제안: form 타입을 정의하고 `useFormContext<ProblemFormValues>()`, `useWatch({ control, name: "tags" }) ?? []`로 `string[]`를 보장한다.
- 기존 실패: `studyStore.ts:6-11`에서 null 초기값과 타입 선언이 맞지 않는다.
  - 수정 제안: nullable 필드는 `string | null`, `number | null`로 선언하거나 실제 초기값을 타입에 맞춘다.

### 오류 처리

- `login/page.tsx:44`에서 `catch` 인자를 제거한 것은 사용하지 않는 변수를 줄이는 점에서는 괜찮다. 다만 모든 로그인 실패가 같은 메시지로 처리되어 네트워크 장애, Supabase 장애, 계정 오류를 구분하지 못한다.
  - 사용자 보안상 인증 실패 메시지를 상세히 노출하지 않는 것은 맞지만, 개발/운영 로그에는 에러 종류를 안전하게 남기는 경로가 필요하다.
- `review-harness.ts:437-445`는 agent별 OpenAI 실패를 warnings에 추가하고 계속 진행한다. 자동 리뷰 전체가 한 agent 실패로 멈추지 않는 점은 좋다.
- `review-harness.ts:823-827`, `873-876`은 Notion/GitHub publish 실패를 warnings로만 남긴다. scheduled job에서 Notion 저장 실패를 성공처럼 통과시키면 “보고서가 저장됐다고 착각”할 수 있다.
  - 수정 제안: `REVIEW_REQUIRE_NOTION=1` 같은 옵션이 켜진 scheduled run에서는 Notion 저장 실패를 non-zero exit로 처리한다.

### 접근성

- `login/page.tsx:111-113`의 비밀번호 보기/숨기기 버튼은 `aria-label`이 있어 기본 접근성은 괜찮다.
- 다만 `login/page.tsx:161`의 `ddong@jj.com || ddong!`는 화면 하단에 의미 없이 노출되는 테스트 계정처럼 보인다. 스크린리더와 사용자 모두에게 제품 UI의 일부처럼 읽히며, 계정 정보 노출 리스크가 있다.
  - 수정 제안: 개발 전용 자동 채우기 영역 안으로 옮기거나 제거한다.

### 성능 / 속도

- `solution2(elements)`는 현재 제품 코드에서 호출되지 않지만 O(n^2) 누적합 계산이다. 사용되지 않는 연습 코드가 번들 또는 타입 체크 대상에 들어가는 것 자체가 성능/유지보수 낭비다.
- `review-harness.ts:426-447`은 review agent를 순차 실행한다. 안정성은 좋지만 agent 수가 늘면 PR 피드백 시간이 선형 증가한다.
  - 수정 제안: rate limit을 고려해 `Promise.allSettled` 또는 제한된 concurrency로 병렬화할 수 있다.
- `runChecks` 기본값이 lint, typecheck, test, build를 모두 실행한다. Next build도 TypeScript를 실행하므로 타입 체크가 중복될 수 있다. CI 시간에 민감하면 PR에서는 빠른 typecheck/lint/test를 먼저 돌리고 build는 별도 job으로 분리하는 구성이 낫다.

### 의존성 사용

- 이번 변경에서 dependency 버전 변경은 없다. `package.json`에 `review` 스크립트만 추가됐고 lockfile 변경은 없다.
- `review-harness.ts`는 Node/Bun 내장 API와 `fetch`만 사용해 새 런타임 의존성을 늘리지 않은 점은 좋다.
- 단, GitHub Actions가 `bun install --frozen-lockfile` 후 PR 브랜치의 `package.json` scripts를 실행한다는 점은 보안 경계와 연결된다. 의존성 설치 스크립트나 `review` 스크립트가 PR에서 바뀌면 secrets와 함께 실행될 수 있다.

### 유지보수성

- `review-harness.ts`의 `Finding`, `CheckResult`, `ReviewReport`, `CliOptions` 타입은 읽기 쉽고 출력 계약을 명확히 하려는 방향이 좋다.
- 반대로 한 파일이 1,200줄을 넘고 외부 I/O가 섞여 있어 단위 테스트가 어려운 구조다. 최소한 pure 함수인 `extractJson`, `normalizeFinding`, `extractReferencedFiles`, `mergeAndSortFindings`, `renderMarkdown`부터 테스트 가능하게 분리하면 좋다.
- `scheduled-study-report.yml:33-34`가 `HEAD~1..HEAD`만 대상으로 한다. scheduled daily report라면 “지난 실행 이후 변경”을 보장하지 못한다. 하루에 커밋이 여러 개 있으면 마지막 커밋만 보고, 커밋이 없으면 같은 HEAD~1 범위를 반복할 수 있다.
  - 수정 제안: 마지막 리뷰 SHA를 artifact/cache/Notion 속성에 저장하고 다음 실행에서 그 SHA부터 현재 HEAD까지 비교한다.

### 가독성 및 네이밍

- `leaveStudy(studyId: number)`는 새 독자가 동작을 빠르게 이해할 수 있는 이름이다. 다만 반환 타입이 암시적 `Promise<void>`라 명시하면 API 계약이 더 분명하다.
- `solution2`, `solution`, `elements2`, `answer`, `ab`, `newArr`, `arr1`, `arr2`는 새 독자가 한눈에 의미와 데이터 형태를 이해하기 어렵다.
  - `solution2` -> `countUniqueCircularSubarraySums`
  - `elements2` -> `doubledElementsForCircularWindow`
  - `answer` -> `uniqueSubarraySums`
  - `ab` -> `windowSum`
  - `solution` -> `multiplyMatrices`
  - `arr1`, `arr2` -> `leftMatrix`, `rightMatrix`
  - `newArr` -> `rowProducts` 또는 실제 목적에 맞는 이름
- `login/page.tsx:33`의 `handleFill`은 클릭 핸들러라는 사실만 있고 무엇을 채우는지 드러나지 않는다.
  - 추천: `fillDevelopmentLoginCredentials`
- `login/page.tsx:38`의 `onSubmit(data)`는 폼 이벤트 문맥에서는 흔하지만, 함수만 떼어 보면 로그인/리다이렉트 side effect가 드러나지 않는다.
  - 추천: `submitLoginAndRedirect`, 인자 `data` -> `loginFormValues`
- `TagSection.tsx`의 `toggleTag(tag)`는 비교적 이해 가능하지만 form state를 mutate한다는 점은 이름에서 드러나지 않는다.
  - 추천: `toggleSelectedAlgorithmTag`
- `review-harness.ts`의 `base`, `head`는 Git diff 문맥에서는 관용적이라 괜찮다. `runShellCommand(command: string)`은 너무 일반적이며 shell 실행이라는 위험한 side effect를 숨긴다.
  - 추천: `runReviewCheckShellCommand` 또는 `runCheckCommand`, 가능하면 문자열 대신 `{ command, args }` 형태.

### API / 시그니처 명확성

- `function solution(arr1, arr2)`는 이름, 파라미터, 반환값만 보고 어떤 행렬 연산인지, shape가 무엇인지, 실패 조건이 무엇인지 알 수 없다. 반환도 `var answer = [[]]`라 `unknown[][]`처럼 보이며 실제 행렬 곱 결과 계약이 없다.
  - 추천 시그니처: `function multiplyMatrices(leftMatrix: number[][], rightMatrix: number[][]): number[][]`
  - 검증: 열/행 길이가 맞지 않으면 명시적으로 throw하거나 Result 타입을 반환한다.
- `createOpenAiReview(prompt: string)`은 OpenAI 호출이라는 side effect가 이름에 드러나고 반환값이 텍스트라는 것도 어느 정도 이해된다. 다만 모델명 기본값이 환경변수와 내부 기본값에 숨어 있으므로 테스트에서 주입 가능하게 분리하면 좋다.
- `exportToNotion(report, warnings)`는 실패 시 throw하지 않고 `warnings`를 mutate한다. 함수 이름만 보면 저장 성공/실패 계약이 불분명하다.
  - 추천: `publishReportToNotionOrWarn`처럼 실패 정책을 이름에 드러내거나 `{ ok: boolean; warning?: string }`을 반환한다.
- `commentOnGitHubPr(report, prNumber, warnings)`도 외부 상태를 변경하고 `warnings`를 mutate한다. PR 코멘트 생성/수정 결과를 반환하지 않아 호출자가 성공 여부를 판단하기 어렵다.

## 5) 리스크

### 빌드/테스트 실패

- 현재 `bun test`, `bun biome check .`, `bunx tsc --noEmit`, `bun next build`가 모두 실패한다.
- 신규 미커밋 변경으로 `AccountSetting/service.ts:43` 타입 오류가 추가됐다.
- 기존 실패가 많아 새 파이프라인이 실제 PR에서 항상 빨간 상태가 될 가능성이 높다. `--fail-on P1` 설정에서는 typecheck/test/build 실패가 P1로 분류되어 PR을 막을 수 있다.

### API 계약 변경

- 제품 API 계약 변화는 크지 않다. 다만 `AccountSetting/service.ts`에 비제품 함수가 들어가면서 모듈의 공개/내부 책임 경계가 흐려졌다.
- `review-harness.ts`의 Markdown/JSON report schema는 새로 생긴 계약이다. report consumer가 생기기 전에 `ReviewReport` 타입과 JSON 출력 형태를 문서화하고 고정하는 것이 좋다.

### 인증/보안 영향

- `.github/workflows/automated-code-review.yml:28-43`에서 PR 브랜치 코드가 secrets와 함께 실행된다. 이 구조는 저장소 내부 브랜치 PR에서 특히 위험하다.
- `src/app/(without-sidebar)/login/page.tsx:161`의 credential-looking 문자열은 실제 계정 여부와 관계없이 사용자 화면에 노출하면 안 된다.
- `console.log(study)`는 사용자 스터디 정보 구조가 브라우저 콘솔에 노출될 수 있다.

### 데이터 처리

- `review-harness.ts`는 diff와 체크 결과를 OpenAI API로 전송한다. private repo나 민감 코드가 포함될 수 있으므로 docs에 전송 범위와 제외 정책을 명시해야 한다.
- Notion export는 report markdown 전체를 paragraph chunk로 저장한다. 민감 diff가 findings나 warnings에 포함되면 Notion으로 전파될 수 있다.

### 사용자 영향 회귀

- 로그인 화면에 테스트 계정처럼 보이는 텍스트가 노출되어 사용자 신뢰를 해칠 수 있다.
- 빌드 실패 상태라 배포 가능성이 없다. 기존 실패가 많더라도 현재 작업 트리의 신규 타입 오류는 즉시 제거해야 한다.

## 6) 우선순위

### 지금 바로 볼 것

1. `.github/workflows/automated-code-review.yml:28-43` 보안 경계 수정
   - PR 코드 실행 job과 secrets 사용 job을 분리한다.
   - PR에서는 `OPENAI_API_KEY`, `NOTION_TOKEN`을 주입하지 않는다.
   - 신뢰된 base workflow 또는 수동 승인 후 publish를 수행한다.
2. `src/app/(with-sidebar)/settings/components/AccountSetting/service.ts:26-56` 제거 또는 이동
   - 제품 서비스 파일에서 알고리즘 연습 코드와 `console.log`를 제거한다.
   - 신규 `arr1`, `arr2` 암시적 `any` 타입 실패를 없앤다.
3. `src/app/(without-sidebar)/login/page.tsx:161` 제거
   - credential-looking 문자열을 화면에서 제거하거나 development guard 안으로 넣는다.
4. 타입 체크 첫 실패부터 정리
   - `TagSection.tsx:83`, `AccountSetting/service.ts:43`, `problems/page.tsx:135` 순서로 빌드 차단을 줄인다.

### 나중에 정리할 것

1. `scripts/review-harness.ts`를 context/checks/agents/render/publish 모듈로 분리
2. `scheduled-study-report.yml`의 `HEAD~1..HEAD` 범위를 “지난 성공 실행 이후” 범위로 변경
3. `review-harness.ts` pure function 단위 테스트 추가
4. Biome 포맷팅과 unused import/variable 정리
5. handler와 form value 네이밍 개선: `handleFill`, `onSubmit(data)` 등
6. Notion/GitHub publish 실패 정책을 옵션화하고 scheduled run에서는 저장 실패를 실패로 처리

## 7) 다음 액션

- 우선 보안: `.github/workflows/automated-code-review.yml`에서 secrets가 untrusted PR 코드와 함께 실행되지 않도록 workflow를 재설계한다.
- 우선 빌드: `AccountSetting/service.ts`의 연습 코드를 제거하고 `TagSection.tsx`의 form 타입을 명시해 `bunx.cmd tsc --noEmit --pretty false`를 다시 실행한다.
- 우선 노출: `login/page.tsx`의 `ddong@jj.com || ddong!`와 `console.log(study)`를 제거한다.
- 검증 명령:
  - `bun.cmd biome check .`
  - `bunx.cmd tsc --noEmit --pretty false`
  - `bun.cmd test ./src/**/*.test.ts`
  - `bun.cmd next build`
  - `bun.cmd run review -- --skip-agents --base ad3850b --head HEAD`
- actionlint가 필요하면 CI 또는 로컬 도구에 추가해 `.github/workflows/*.yml` 문법을 자동 검증한다.
