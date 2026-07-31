# 제출 전 코드 정리 체크리스트

이력서 제출 전에 저장소를 "채용 담당자가 열어봐도 되는 상태"로 만드는 작업 목록.

현재 기본 브랜치(`Nexts`)는 `bun run build`, `tsc --noEmit`, `bun test`가 **모두 실패**한다.
이력서에 GitHub URL을 적는 이상, 이 세 가지가 통과하는 것이 최소 조건이다.

---

## 작업 순서

### 1. PR #6 머지 — 공개 노출된 테스트 계정 제거

`🔒 fix: 화면·리포트에 노출된 테스트 계정 문자열 제거`

- [ ] PR #6 머지
- [ ] 해당 Supabase 계정 **비밀번호 변경**

공개 저장소 로그인 화면 코드에 계정/비밀번호가 박혀 있던 상태라 이것부터 처리한다.

---

### 2. PR #7 파일별 처리

`🐛 fix: 타입 오류·타임존 버그 정리 + 테스트 추가 + 리뷰 워크플로 시크릿 분리`

AI가 생성한 PR이다. **전부 받아들이지 말고 아래 기준으로 나눈다.**

> 판단 기준: **면접에서 "이걸 왜 이렇게 고쳤냐"고 물으면 답할 수 있는가?**

| 파일 | 처리 | 이유 |
|---|---|---|
| `Heatmap/hook.test.ts` | 그대로 | 타임존 고정 + 적용 확인 테스트까지 잘 작성됨 |
| `LineChart/hook.test.ts` | 그대로 | 동일 |
| `Heatmap/hook.ts` | 그대로 | `format()` 적용. 검증 완료 |
| `LineChart/hook.ts` | 그대로 | `format()` + 범위 `-5~0`. 검증 완료 |
| `MakeStudy.tsx` | 그대로 | 주석 해제. 판단할 것 없음 |
| `Sidebar.tsx` | 그대로 | `study?.id` guard 한 줄 |
| `calendar.tsx` | 그대로 | react-day-picker 버전 타입 문제 |
| **`TagSection.tsx`** | **직접 다시 작성** | 오류만 지운 우회 수정 |
| **`studyStore.ts`** | **설계 결정** | 두 안 중 선택 |
| **`tsconfig.json`** | **판단** | 부작용 인지하고 유지 여부 결정 |
| **`.github/workflows/automated-code-review.yml`** | **읽고 검토** | 57줄 추가. 내용 확인 필요 |
| **`problems/page.tsx`** | **확인** | 13줄 변경분이 무엇인지 확인 |

#### 2-1. `TagSection.tsx` — 직접 다시 쓸 것

```ts
// PR 상태: 오류만 사라지고 타입 안정성은 그대로
const selectedTags: string[] = useWatch({ control, name: "tags" }) ?? [];
//                  ^^^^^^^^ any 에 이름표만 붙인 것. 숫자 배열이 와도 컴파일러는 모름
```

```ts
// 목표
// 1. ProblemFormValues 를 ProblemAddModal.tsx 밖 공용 타입으로 분리
// 2. const { setValue, control } = useFormContext<ProblemFormValues>();
// 3. const selectedTags = useWatch({ control, name: "tags" }) ?? [];
//    → 제네릭이 연결되어 타입이 자동으로 string[]
```

React Hook Form 제네릭 연결은 프론트엔드 면접 단골 주제다. 우회한 채로 두지 않는다.

#### 2-2. `studyStore.ts` — 두 안 중 선택

```ts
// A안 (현재 PR): 필드마다 nullable
interface StoredStudy { id: number | null; name: string | null; /* ... */ }
// → 사용하는 쪽에서 필드마다 null 체크 필요

// B안: 스터디가 있거나 없거나
atomWithStorage<Study | null>("study_storage", null)
// → 한 번만 체크하면 이후 필드는 타입이 보장됨
```

B안이 더 낫지만 참조하는 곳을 함께 손봐야 한다.
시간이 없으면 A안 유지 — 단, **왜 A안을 골랐는지 설명할 수 있어야 한다.**

#### 2-3. `tsconfig.json` — 부작용 인지 후 결정

```json
"exclude": ["node_modules", "**/*.test.ts"]
```

테스트 파일을 `next build` 타입 검사에서 제외하는 것 자체는 합리적이다.
다만 **테스트 파일이 타입 검사를 전혀 받지 않게 되는** 부작용이 있다.
지금은 유지하고, 이후 `tsconfig.test.json` 분리를 검토한다.

---

### 3. 검증 — 세 가지 모두 통과할 것

- [ ] `bun run build`
- [ ] `./node_modules/.bin/tsc --noEmit`
- [ ] `bun test`

`npx tsc` 는 다른 패키지를 받아오므로 `./node_modules/.bin/tsc` 를 사용한다.

---

### 4. 브랜치 보호 규칙 설정

- [ ] Settings → Branches → Add rule → `Nexts`
- [ ] Require status checks to pass → `checks` 선택

현재는 보호 규칙이 없어 **체크가 실패해도 머지가 된다.** (PR #5가 `fail` 상태로 머지된 사례)

**3번이 통과한 뒤에 켠다.** 먼저 켜면 본인이 머지할 수 없게 된다.

이 설정을 마쳐야 이력서의 "P1 발견 시 병합을 차단하는" 문구가 사실이 된다.

---

### 5. 일간 리포트 재실행

- [ ] 리포트 결론이 `배포 가능한 상태가 아닙니다` 에서 바뀌는지 확인

포트폴리오의 "혼자 개발하는 프로젝트의 리뷰 공백 줄이기" 섹션의 근거가 된다.
수정 전후 리포트를 캡처해 둘 것.

---

### 6. 시간이 남으면

- [ ] `src/app/api/extension/_shared.ts` — CORS `*` 를 allowlist 로 변경
- [ ] `problems/page.tsx` — queryKey 에서 `openProblem`, `openAddProblem` 제거하고 등록 성공 시 `invalidateQueries` 호출
- [ ] `History.tsx`, `MonthlySolve.tsx` 삭제 (`Heatmap/`, `LineChart/` 와 중복)
- [ ] biome 70 errors / 28 warnings 정리
- [ ] `getAuthedMember` 를 discriminated union 반환으로 변경

---

## 참고 — 자동 리뷰 리포트가 지적한 것 중 미처리 항목

일간 리포트(2026-07-30)의 `지금 바로 볼 것`:

1. `tsc --noEmit` 오류 11건 → **2번에서 처리**
2. `bun run build` 통과 확인 → **3번에서 처리**
3. `_shared.ts` CORS origin allowlist → **6번**
4. 최소 smoke test 추가 → **2번에서 처리 (테스트 2파일)**

`나중에 정리할 것`:

1. `problems/page.tsx` 를 필터/data/list/dialog 단위로 분리
2. Heatmap·월별 차트 중복 로직을 공용 도메인 유틸로 통합
3. `data` / `value` / `result` / `item` 이름을 도메인 이름으로 변경, API 반환 타입 명시
4. `console.log` 와 오래된 주석 코드 제거
5. 모달·태그 토글·확장 패널 접근성 보강
