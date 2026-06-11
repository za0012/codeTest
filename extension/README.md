# CodeTest Study Uploader

프로그래머스에서 푼 문제를 현재 스터디 프로젝트의 `problems` 테이블에 올리는 개인용 Chrome 확장 프로그램 초안입니다.

스토어 출시용이 아니라, Chrome 개발자 모드에서 `압축해제된 확장 프로그램`으로 직접 로드해서 테스트하는 용도입니다.

## 지금 되는 기능

- 확장 프로그램 popup에서 서비스 계정으로 로그인합니다.
- 로그인 세션을 Chrome local storage에 저장합니다.
- 프로그래머스 문제 페이지에서 오른쪽 아래 `스터디 업로드` 버튼을 보여줍니다.
- 제출 결과가 통과로 보이면 업로드 패널을 자동으로 엽니다.
- 자동 감지가 안 되면 `스터디 업로드` 버튼으로 직접 열 수 있습니다.
- 패널에서 메모만 적고 업로드할 수 있습니다.
- 문제 제목, URL, 난이도, 태그 후보, 코드 본문을 가능한 범위에서 자동 수집합니다.
- 같은 사용자가 같은 문제 URL을 다시 올리면 중복 업로드하지 않습니다.

## 전체 구조

```text
codeTest/
  src/app/api/extension/
    _shared.ts
    auth/login/route.ts
    auth/refresh/route.ts
    auth/me/route.ts
    problems/route.ts

  extension/
    manifest.json
    popup.html
    popup.css
    popup.js
    background.js
    content.js
    content.css
    page-bridge.js
    README.md
```

## 데이터 흐름

1. 사용자가 확장 프로그램 popup에서 이메일과 비밀번호를 입력합니다.
2. popup이 Next.js API인 `/api/extension/auth/login`으로 로그인 요청을 보냅니다.
3. 서버는 Supabase `signInWithPassword`로 로그인하고, 사용자의 `study_members` 정보를 찾습니다.
4. 확장 프로그램은 `accessToken`, `refreshToken`, `member`, `user` 정보를 `chrome.storage.local`에 저장합니다.
5. 프로그래머스 문제 페이지에 `content.js`가 주입됩니다.
6. `content.js`가 통과 문구를 감지하거나 사용자가 버튼을 누르면 업로드 패널을 엽니다.
7. 사용자가 메모를 입력하고 업로드 버튼을 누릅니다.
8. `content.js`가 문제 정보와 코드를 수집해서 `background.js`로 보냅니다.
9. `background.js`가 `/api/extension/problems`에 문제 등록 요청을 보냅니다.
10. 서버는 access token으로 사용자를 확인하고 `problems` 테이블에 insert합니다.

## 왜 확장 프로그램에서 Supabase에 바로 넣지 않았나

확장 프로그램에서 Supabase를 직접 호출하게 만들 수도 있지만, 초안에서는 Next.js API를 한 번 거치게 만들었습니다.

이유는 다음과 같습니다.

- `member_id`, `study_id`를 서버에서 확실하게 결정할 수 있습니다.
- 로그인한 사용자가 실제 스터디 멤버인지 API에서 검증할 수 있습니다.
- 중복 업로드 방지 같은 정책을 한 곳에 둘 수 있습니다.
- 나중에 백준, LeetCode, SWEA를 붙여도 업로드 규칙은 서버 API 하나로 유지할 수 있습니다.

## 추가된 API

### `POST /api/extension/auth/login`

확장 프로그램 로그인용 API입니다.

요청:

```json
{
  "email": "test@example.com",
  "password": "password"
}
```

응답:

```json
{
  "session": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresAt": 1234567890
  },
  "user": {
    "id": "...",
    "email": "test@example.com"
  },
  "member": {
    "id": 1,
    "study_id": 1,
    "name": "사용자",
    "emoji": "..."
  }
}
```

### `POST /api/extension/auth/refresh`

access token이 만료됐을 때 refresh token으로 새 세션을 받는 API입니다.

요청:

```json
{
  "refreshToken": "..."
}
```

### `GET /api/extension/auth/me`

현재 access token이 유효한지 확인하는 API입니다.

헤더:

```text
Authorization: Bearer ACCESS_TOKEN
```

### `POST /api/extension/problems`

프로그래머스 문제를 스터디에 올리는 API입니다.

헤더:

```text
Authorization: Bearer ACCESS_TOKEN
```

요청:

```json
{
  "title": "문제 제목",
  "url": "https://school.programmers.co.kr/learn/courses/30/lessons/12901",
  "difficulty": "Lv.1",
  "tags": ["연습문제"],
  "solution": "function solution() { ... }",
  "memo": "풀이 메모",
  "timeSpentMinutes": 0
}
```

서버에서 자동으로 채우는 값:

- `platform`: `프로그래머스`
- `study_id`: 로그인한 멤버의 스터디 ID
- `member_id`: 로그인한 멤버 ID
- `date`: 한국 시간 기준 오늘 날짜

## 로컬에서 실행하는 방법

### 1. 프로젝트 서버 실행

프로젝트 루트에서 실행합니다.

```bash
bun next dev
```

Windows PowerShell에서 `bun.ps1` 실행 권한 때문에 막히면 아래처럼 실행합니다.

```powershell
bun.cmd next dev
```

기본 서버 주소는 다음과 같습니다.

```text
http://localhost:3000
```

popup의 `서버 주소` 입력칸도 기본값이 `http://localhost:3000`입니다.

### 2. Chrome 확장 프로그램 로드

1. Chrome에서 `chrome://extensions`를 엽니다.
2. 오른쪽 위 `개발자 모드`를 켭니다.
3. `압축해제된 확장 프로그램을 로드`를 누릅니다.
4. 이 프로젝트의 `extension` 폴더를 선택합니다.

예시 경로:

```text
C:\Users\yhj\Desktop\개인용\codeTest\extension
```

### 3. 확장 프로그램 로그인

1. Chrome 오른쪽 위 확장 프로그램 아이콘을 누릅니다.
2. `CodeTest Study Uploader`를 엽니다.
3. 서버 주소가 `http://localhost:3000`인지 확인합니다.
4. 서비스 계정 이메일과 비밀번호로 로그인합니다.
5. 로그인 후 스터디 멤버 이름이 보이면 준비 완료입니다.

### 4. 프로그래머스에서 업로드 테스트

1. 프로그래머스 문제 페이지로 이동합니다.

```text
https://school.programmers.co.kr/learn/courses/30/lessons/12901
```

2. 오른쪽 아래 `스터디 업로드` 버튼이 보이는지 확인합니다.
3. 코드를 제출합니다.
4. 통과가 감지되면 업로드 패널이 자동으로 열립니다.
5. 자동으로 열리지 않으면 오른쪽 아래 `스터디 업로드` 버튼을 직접 누릅니다.
6. 메모를 입력합니다.
7. 난이도가 틀리면 직접 바꿉니다.
8. `스터디에 올리기`를 누릅니다.
9. 프로젝트의 문제 목록에서 올라갔는지 확인합니다.

## 파일별 역할

### `manifest.json`

Chrome 확장 프로그램 설정 파일입니다.

중요 설정:

- `manifest_version: 3`
- popup: `popup.html`
- background service worker: `background.js`
- 프로그래머스 문제 페이지에 `content.js`, `content.css` 주입
- 로컬 Next 서버 호출 권한: `http://localhost:3000/*`
- 프로그래머스 페이지 접근 권한: `https://school.programmers.co.kr/*`

### `popup.html`, `popup.css`, `popup.js`

확장 프로그램 아이콘을 눌렀을 때 나오는 작은 로그인 화면입니다.

하는 일:

- 서버 주소 입력
- 이메일, 비밀번호 로그인
- 로그인 성공 시 토큰과 멤버 정보 저장
- 로그아웃

저장 위치:

```text
chrome.storage.local
```

저장하는 값:

- `apiBaseUrl`
- `accessToken`
- `refreshToken`
- `expiresAt`
- `member`
- `user`

### `background.js`

확장 프로그램의 백그라운드 service worker입니다.

하는 일:

- content script에서 온 업로드 요청 받기
- 저장된 access token으로 Next API 호출
- 401 응답이 오면 refresh token으로 세션 갱신 후 재시도
- popup/content script 사이에서 로그인 상태 전달

### `content.js`

프로그래머스 문제 페이지에 직접 주입되는 스크립트입니다.

하는 일:

- 오른쪽 아래 `스터디 업로드` 버튼 추가
- 통과 결과 문구 감지
- 업로드 패널 표시
- 문제 제목, URL, 난이도, 태그 후보 수집
- `page-bridge.js`를 통해 에디터 코드 읽기 시도
- 최종 payload를 `background.js`로 전송

통과 감지에 사용하는 후보 문구:

- `정답입니다`
- `모든 테스트 ... 통과`
- `채점 결과 ... 통과`
- `합계: 100.0`

실패로 판단하는 후보 문구:

- `실패`
- `오답`
- `컴파일 에러`
- `런타임 에러`

### `content.css`

프로그래머스 페이지 위에 뜨는 버튼과 업로드 패널 스타일입니다.

### `page-bridge.js`

프로그래머스 페이지 내부의 에디터 코드에 접근하기 위한 브릿지입니다.

content script는 Chrome 격리 환경에서 실행되기 때문에 페이지의 `window.monaco`, `window.ace` 같은 객체를 바로 읽기 어렵습니다. 그래서 `page-bridge.js`를 페이지에 `<script>`로 삽입하고, 읽은 코드를 custom event로 content script에 넘깁니다.

읽기 시도 순서:

1. Monaco editor model
2. Ace editor instance
3. DOM fallback

## 현재 제한사항

- 프로그래머스 페이지 DOM 구조가 바뀌면 제목, 난이도, 코드 추출이 틀릴 수 있습니다.
- 통과 감지는 화면 텍스트 기반이라 프로그래머스 결과 문구가 바뀌면 놓칠 수 있습니다.
- 난이도는 페이지에서 `Lv.0`~`Lv.5` 텍스트를 찾지 못하면 `Lv.0`으로 둡니다.
- 문제 태그는 breadcrumb와 링크 텍스트에서 후보만 가져옵니다.
- 풀이 시간은 아직 자동 측정하지 않고 기본값 `0`으로 보냅니다.
- Chrome Web Store 출시용 아이콘, 설명, 권한 최소화, 개인정보 처리 문구는 아직 없습니다.
- 현재 host permission은 로컬 테스트 기준으로 `localhost:3000`에 맞춰져 있습니다.

## 자주 막힐 수 있는 부분

### popup에서 로그인이 안 될 때

- Next 개발 서버가 켜져 있는지 확인합니다.
- popup의 서버 주소가 실제 서버 주소와 같은지 확인합니다.
- 계정이 스터디에 참여된 상태인지 확인합니다.
- 브라우저 개발자 도구의 확장 프로그램 service worker 로그를 확인합니다.

### 업로드는 눌렀는데 등록이 안 될 때

- 이미 같은 URL을 같은 멤버가 올린 문제인지 확인합니다.
- Supabase RLS 정책이 현재 사용자 insert를 허용하는지 확인합니다.
- `/api/extension/problems` 응답 메시지를 확인합니다.

### 코드가 비어 올라갈 때

- 프로그래머스 에디터 구현이 현재 추출 방식과 다를 수 있습니다.
- 우선 문제 제목, URL, 메모 업로드가 되는지 확인합니다.
- 이후 실제 DOM을 보고 `page-bridge.js`나 `readCodeFromDom()` 선택자를 보강해야 합니다.

## 다음에 붙이면 좋은 것

- 프로그래머스 실제 제출 결과 페이지/모달별 DOM 확인
- 코드 추출 실패 시 패널 안에 코드 직접 붙여넣기 칸 추가
- 풀이 시작 시간 저장 후 통과 시 `time_spent` 자동 계산
- 문제 번호 또는 lesson id 별 중복 처리 강화
- 백준, LeetCode, SWEA content script 추가
- 확장 아이콘 추가
- 운영 배포 주소를 host permission에 추가
