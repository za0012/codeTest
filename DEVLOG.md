# 간단하게 라이브러리 결정, 문제 해결 관련 문서

## 라이브러리

### bun

패키지 매니저, 번들러, 런타임, 테스트 약 5가지를 하나가 해주는 그런 친구다.
bun의 장점이라 하면 뭐라해도 속도이다.
자세한 건 노션에 정리를 해놓았다.

### husky

husky.
커밋을 하다 보면 에러가 있어도, 문제가 있어도, prettier에 문제가 있어도 커밋은 된다. git action에서 pr시 걸러낼 수는 있다만...
커밋할 때 그런 에러들을 해결하면 편하지 않은가? 그래서 추가했다.
내가 모르는 에러들을 커밋 전에 잡아줘서 편하다.

### tanstack query

우선 설정 방법은 provider.tsx 라는 파일을 만든 후 layout에 children을 해당 파일로 감싸주면 된다...

[참고링크 1](https://codevoweb.com/setup-react-query-in-nextjs-13-app-directory/)
[참고링크 2](https://velog.io/@ienrum/next.js-%EC%97%90%EC%84%9C-tanstack-query-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

그래서 내가 왜 tq를 넣었는지에 대해 설명을 해보겠다.

### react hook form

원래는 useState와 handleSubmit으로 코드를 관리하고 있었다. 한 페이지 안에 입력 필드가 많아봤자 2~4개였으니 별로 필요성을 못 느꼈다고 해야할까.
문제는 여기서부터다.

그래서 내가 왜 rhf를 넣었는지에 대해 설명을 해보겠다.

### framer-motion

## 문제 해결

### No tests found! Tests need ".test", "_test_", ".spec" or "_spec_" in the filename (ex: "MyApp.test.ts")

husky 설정 파일인 pre-commit에 bun lint-staged 전줄에 bun test이 있었다.
허나 bun test 할 파일이 존재하지 않아 테스트를 할 수가 없기에 커밋 확인으로 넘어가지 않아 발생하는 문제였다.
pre-commit에 있는 bun test 삭제로 해결.

### error: Script not found "lint-staged" husky - pre-commit script failed (code 1)

husky가 lint-staged를 실행하려고 했는데, package.json에 해당 명령어가 등록되어 있지 않아 발생하는 문제였다.
(pre-commit에서 lint-staged를 하려고 했는데 그런 이름이 등록되지 않아서 그런 스크립트 없는데? 하고 튕긴 것...)
lint-staged 패키지 설치하면서 해결했다.(커밋할 때 코드 스타일을 자동으로 정리)

### [0;31m✖[0m lint-staged could not find any valid configuration. husky - pre-commit script failed (code 1)

lint-staged에 설정 파일이 없어 발생한 문제였다.
실행 스크립트가 있어서 실행은 됐는데, 어떤 파일을 검사하라는건지 구체적인 지침이 없어서 에러가 발생한 것이다.
아래와 같이 package.json에 검사 규칙을 추가하면 된다.

```js
"lint-staged": {
    "*.{js,ts,jsx,tsx}": "bun test"
},
```

\*.{js,ts,jsx,tsx} -> 커밋하려고 올린(staged) 파일들 중에 확장자가 js, ts, jsx, tsx인 파일들을 찾아서,
bun test -> 그 파일들에 대해 테스트를 돌려라! 라는 뜻이다.

### The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: <https://nextjs.org/docs/messages/middleware-to-proxy>

로그인이 됐을 때, 로그인이 되지 않았을 때 진입 가능한 페이지를 제한하고 싶어서 찾아보다 알아낸 게 middleware였다.
[블로그 링크](https://kinggh.tistory.com/128)
파일명은 꼭 middleware여야 하고, 안에 들어있는 함수명도 middleware로 해야 동작하는 방식이었다.
뭐 설정해줘야 하나 했는데 그건 아니었고 진짜 그냥 파일 생성하고 안에 함수명만 넣어주면 바로 동작하는...

그런데 실행시키니까 위와 같은 오류 메세지가 떴다. 해당 링크로 들어가서 알아보니 "이젠 우린 proxy로 바꾸겠다! 아래 명령어만 실행시키면 된다!" 이런 거였어서 명령어 실행...
근데 too many relendering... 이 떠서 이것저것 다 해봤다... node_modules 삭제도 해보고 proxy 파일도 이것저것 바꿔보고 쿠키도 삭제해보고... 근데도 여전해서 이전에 잘 됐던 코드로 잠깐 수정해서 해보니 잘 됨...

둘이 차이점을 비교해보니 ! 이거 하나였다...
!request.nextUrl.pathname.startsWith("/login") -> request.nextUrl.pathname.startsWith("/login")
예 이렇게 해결했습니다. 아마 계속계속 home으로 돌아가게 돼서 그런 게 아니었을까 싶다.

### FieldError' 형식은 'ReactNode' 형식에 할당할 수 없습니다

react hook form의 trigger로 유효성 검사를 할 때 유효성 검사를 통과하지 못할 때 에러 문구를 해당 필드 하단에 넣어야 하는 상황이었다.

```js
{
  errors.emoji && (
    <p className="mt-2 ml-2 text-red-400">{errors.emoji.message?}</p>
  );
}
```

react-hook-form의 에러 객체(FieldError)가 React가 렌더링할 수 있는 문자열이나 컴포넌트(ReactNode)가 아니기 때문에 발생한다. 즉 message가 텍스트 혹은 number가 아닌 형식이라는 것... (string | FieldError | Merge<FieldError, FieldErrorsImp>) 임...
그래서 string 형식으로 만들면 해결이 된다. .toString()? 밖에 없는 것 같다. .message를 사용하면 해결이 된다고는 하는데, 그게 아니어서

## 코드

### 괄호로 파일 묶어서 layout 다르게 하기

[참고 링크](https://velog.io/@h22ju/Next.js-Per-Page-Layouts)
괄호로 각 페이지 묶은 후 안에 layout.tsx로 처리해주면 된다.
여기서 참고할 부분은 그 안에 들어간 layout.tsx는 html, body가 아닌 section으로 처리해주어야 한다는 것.

작동 방식은
Next.js App Router에서는 특정 폴더를 "경로 그룹(경로 그룹 폴더를 괄호로)" 으로 설정하면, 해당 폴더가 URL 경로에서 제외된다.
다만 최상위 layout과 폴더 내부에 있는 layout은 중첩되므로 참고하자.

### use client와 router

간단하게 use client 에서 link에서 가져온 router는 에러를 발생시킨다. 하지만 navigation에서 가져온 건 괜찮다...
[링크](https://nextjs-ko.org/docs/app/building-your-application/routing/linking-and-navigating)

### FC 교체하기

FC는 function component의 줄임말로 react.ts 조합으로 개발할 때 사용하는 타입이다.
함수형 컴포넌트 사용 시 타입 선언에 사용할 수 있도록 React에서 제공한다.

```ts
type UserProps = {
  name: string;
};

const Profile: React.FC<UserProps> = ({name}) => {
  <div> 안녕하세요, {name}님 <div>
);

export default Profile;
```

허나 FC 사용 시 props는 children을 암시적으로 가지게 된다.
즉 컴포넌트에서 children을 다루고 있지 않을 때 해당 컴포넌트로 children을 넘겨도 런타임 에러가 발생하지 않는다는 것이다. -> 타입스크립트 목적에 어긋남

이 외에도 제네릭 문법 지원X, 네임 스페이스 패턴 이용시 더 불편해진다는 점이 있다.

참고: [React.FC 사용 지양하기](https://velog.io/@frombozztoang/React.FC-%EC%82%AC%EC%9A%A9-%EC%A7%80%EC%96%91%ED%95%98%EA%B8%B0)

### 'InputProps' 인터페이스는 `InputHTMLAttributes<HTMLInputElement>` 및 'VariantProps 형식을 동시에 확장할 수 없습니다. 명명된 속성 'size'의 형식 `InputHTMLAttributes<HTMLInputElement>` 및 'VariantProps'이(가) 동일하지 않습니다

음 원인은 간단한데, size 때문이다.
input에서는 기본적으로 size라는 속성이 있다. 그런데 해당 속성은 number 를 사용한다. 즉 size 의 string과 충돌이 일어나서 발생한 것...
해결 방법도 간단하다. `InputHTMLAttributes<HTMLInputElement>` 이게 input의 속성을 타입으로 가져와서 넣어주는 건데, 여기서 size를 Omit으로 제외하면 된다.
`Omit<InputHTMLAttributes<HTMLInputElement>, "size">` 이걸 넣으면 해결~

> 여기서 잠깐! Omit이란?
> Omit은 유틸리티 타입 중 하나로,특정 속성만 제거한 타입을 정의한다. pick의 반대라고도 볼 수 있다.
> 사용 방법은 Omit<~, "제외할 속성"> 이다.
> 여러 개를 제외할 떄는 | 멀티플 키를 사용하면 된다. (|)

### 커스텀 훅에 대하여

alert창으로 에러 혹은 문제 상황 발생 시 메세지가 나오도록 설정했다.
그런데 onClose을 해당 컴포넌트를 호출하고 있는 쪽에서 호출하고 있는 부분을 보며 안에서 호출해도 되지 않나? 싶었다.
그래서 커스텀alert 컴포넌트 내부에 훅을 호출해서 closeFn을 실행시켰더니 해당 Fn은 작동을 하는데, alertData에는 영향을 못 미쳐서 alert창이 닫히지 않는 문제가 발생했다.
분명 null인 건 표시가 되는데, 해당 컴포넌트에겐 미치지 않다니...

알아보니 커스텀 훅은 싱글톤이 아니기 때문에 같은 파일에서 호출해서 사용하지 않는 한 훅으로 넣은 데이터를 훅으로 가져올 수도, 변경된 값을 가져올 수도 없다는 것이다...
즉 다른 파일에서 같은 훅을 사용하더라도 서로 완전히 다른 메모리 공간에 있는 상태를 참조하고 있는 것이다.
A 컴포넌트에서 훅 사용 → 44 ~ 47번 메모리 차지
B 컴포넌트에서 훅 사용 → 74 ~ 77번 메모리 차지
A 컴포넌트에서 useAlert() 호출 → alertData_A 생성
B 컴포넌트에서 useAlert() 호출 → alertData_B 생성

파일 내부에서 closeAlert를 실행하면 Alertcustom 전용으로 만들어진 내부 상태만 null로 바뀔뿐 부모인 Page가 가지고 있는 alertData에는 아무런 영향을 주지 못한다.

커스텀 훅을 사용하면 어디서든 같은 데이터를 공유한다 -> X
커스텀 훅은 상태를 공유하는 것이 아닌, 상태를 만드는 로직을 복사해서 붙여넣는 것과 같다...

커스텀 훅과 zustand... 무엇이 더 좋을지 고민해보는 것이 좋을 것 같다.

### 커스텀 훅에서 Jotai로

4

### handleSubmit과 trigger

trigger는 react hook form에 있는 메서드 중 하나다.
trigger안에 있는 필드가 유효성을 만족했는지 확인해주는 메서드이다.
그래서 `const isEmail = await trigger("email");` 이런 식으로 true, false를 반환해준다.

로그인 폼 제출 중에 비밀번호 자릿수와 이메일 유효성 검사를 넣었었는데, trigger가 필요한 줄 알고 trigger를 만족시키면 로그인 api를 호출하도록 코드를 짜놨었다.

그런데 알아보니 handleSubmit(onSubmot)에서 onSubmit 안에서 trigger를 호출할 필요가 거의 없다. handleSubmit이 이미 validation을 통과한 데이터만 onSubmit에 넘겨주기 때문이다... 그래서 register와 같이 handleCheck으로 데이터를 넘겨주는 것이 아니라면 submit에는 trigger를 잘 사용하지 않게 될 것 같다...

### tag의 값이 변하지 않는 문제

provider와 context로 form을 받아와서 watch로 값을 넣어주고 있었는데 값이 안 들어감.

```ts
const { watch } = useForm({ defaultValues: { tags: [] } });

const toggleTag = (tag: string) => {
  const nextTags: string[] = selectedTags.includes(tag)
    ? selectedTags.filter((t: string) => t !== tag)
    : [...selectedTags, tag];
  console.log(nextTags);
  console.log(selectedTags);
  setValue("tags", nextTags); //setValue가 통하지 않음... 그래서 아무리 값을 넣어도 undifined가 뜸
  console.log(watch("tags"));
};
```

원인은 여기서 찾아볼 수 있는데, useForm을 통해서 watch를 다시 호출해오고 있다.
내 생각이지만, 이 react hook form은 커스텀 훅처럼 동일한 훅을 호출해도 다른 파일에서 호출하고 있기 때문에 값이 안 나오는 게 아닐까 생각했다.
그래서 Provider로 훅을 가져와 넣어줬더니 값이 들어가는 게 보였다.

문제는 보이기만 하고 그 가져온 값을 setValue가 덮어주는데, 그게 버튼을 누를 때마다 초기화 된다는 것이다.
정확하게는 값이 들어가지 않는 것...

```ts
const { setValue, watch } = useFormContext();

// const { watch } = useForm({ defaultValues: { tags: [] } });
const selectedTags = watch("tags");

const toggleTag = (tag: string) => {
  const nextTags: string[] = selectedTags.includes(tag)
    ? selectedTags.filter((t: string) => t !== tag)
    : [...selectedTags, tag];
  setValue("tags", nextTags);
  //setValue가 통하지 않음... 그래서 아무리 값을 넣어도 undifined가 뜸
  // 뭐 수정하고 렌더링이 바뀌면 바뀌긴 함... 그러니까 값이 실시간으로 바뀌진 않는다는 것.
  // 선택 후 렌더링이 되고 나서 값이 적용이 된다.
  // 그러니까 버튼 선택으로 값 삽입 후 리렌더링이 일어나야 selectedTags에 값이 들어간다는 것이댜.
  console.log(watch("tags"));
  console.log(selectedTags);
};
```

이 문제를 해결하기 전 알고 가면 좋은 지식이 있다.
RHF은 리렌더링 최소화의 이유로 react state를 거의 안 쓴다.
즉 값이 바뀌어도 구독한 컴포넌트만 선택적으로 리렌더링 시키는 게 RHF의 핵심 철학이다.

form state -> ref로 관리
subscription 시스템 -> 변경 알림만 담당
각 컴포넌트 -> 구독한 필드 변경 시에만 리렌더

문제는 watch를 useWatch로 바꾸면서 해결이 되었는데, 왜 watch는 안 됐고 useWatch는 무엇이고 왜 됐는지 서술해볼까 한다.

watch의 역할은 현재 값을 읽기, 해당 컴포넌트를 subscription에 등록(필드 변경 시 리렌더 유발)이다.

### alternative text title element cannot be empty svg

간단하게 biome 오류인데(경고 아님) svg안에 title이 없어서 발생하는 문제이다.

```ts
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="1.5" cy="1.5" r="1.5" />
</svg>
```

```ts
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <title className="text-white">Pass</title>
  <circle cx="1.5" cy="1.5" r="1.5" />
</svg>
```

이렇게 title넣어주면 된다.

참고: [biome 공식](https://biomejs.dev/linter/rules/no-svg-without-title/)

### 히트맵 관련

히트맵은 라이브러리가 없어, 직접 구현하기로 했다.
준비물은 간단하다. svg와 툴팁. 처음 구현이 좀 막막했다. 어디서부터 어떻게 시작해야할지 몰라서...
대강 느낌은 알겠는데, 그 느낌을 어떻게 구현을 해야할지 모르겠다고 해야할까
svg안에 원을 map으로 출력하고 그 circle에 tooltip을 hover시 visible하면 생기도록 설정...
tooltip 때문에 좀 많이 멀리 돌아서 왔다.

### avoid passing children using a prop

biome 에러인데, 간단하게 내가 컴포넌트의 props로 ReactElement를 넘겨주었다.
그런데 `children={<div></div>}` 이런 식으로 할당해서 나온 오류이다.
해결 방법은 간단한데, 그냥 children=~이런 식으로 넣는 게 아니라

```ts
<Component><div></div></Component>
```

이렇게 넣으면 바로 오류가 사라진다.

### invalidateQueries로 api함수를 다시 호출했음에도 불구하고 데이터가 다르게 출력된 것

```ts
  const deleteStudyFunction = async (studyId: number) => {
    await scheduleDeleteStudy(studyId);
    await queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
    if (!studyInfo?.delete_scheduled_at)
      return setAlert({
        title: "스터디 삭제",
        content: "다시 시도해주세요",
        variant: true,
      });
    setModal(null);
    setAlert({
      title: "스터디 삭제",
      content: ${new Date(studyInfo.delete_scheduled_at).toLocaleDateString("ko-KR")}에 스터디가 삭제될 예정이에요.,
      variant: false,
    });
  };
```

우선 코드는 이러하다. 코드 흐름 상 scheduleDeleteStudy로 스터디를 삭제하고
invalidateQueries로 해당 쿼리키를 가진 queryFn을 다시 불러와 해당 데이터를 다시 가져온 뒤,
그 데이터에 삭제일 여부에 따라 스터디 삭제 안내 alert가 나타날 예정이었다.

그런데 계속 여부 확인에서 false가 나와 setAlert가 작동하게 되었다. 분명 invalidateQueries로 데이터를 다시 호출했는데, 무슨 일인가 싶어 좀 알아봤다.

원인은 생각보다 간단한데, 해당 함수를 호출한 시점의 스냅샷, 즉 데이터를 가져오기 때문에 아무리 데이터를 갱신해도 해당 데이터를 가져올 수 없는 것이었다.

invalidateQueries는 React Query 캐시를 무효화하고 다시 가져오게 만들지만, 현재 실행 중인 함수 안의 studyInfo 변수 자체를 새 값으로 바꿔주지는 않기 때문...

다행인 건 해당 api가 데이터를 반환하기 떄문에 해당 데이터로 처리함으로써 해결했다.

## 기타

### 정책 수정

```sql
-- 기존 정책 삭제
drop policy if exists "same study members can read" on study_members;
drop policy if exists "study members can read" on studies;
drop policy if exists "study members can read problems" on problems;
-- study_members: 본인 것만 조회
create policy "read own study_members" on study_members
  for select using (user_id = auth.uid());
-- study_members 테이블에서 SELECT 할 때 각 row마다 확인:
--  "이 row의 user_id가 지금 로그인한 사람 UUID랑 같아?"
--  → 같으면 반환
--  → 다르면 안 보임

-- studies: 로그인한 유저면 조회 가능
create policy "read studies" on studies
  for select using (auth.uid() is not null);
-- problems: 로그인한 유저면 조회 가능
create policy "read problems" on problems
  for select using (auth.uid() is not null);
```

기존은 멤버 조회를 하려면 study_members를 확인해야 했는데, study_members를 확인하려면 study_members를 확인해야하고 study_members를 확인하려면 study_members를 확인해야하고...
이런 식으로 무한돌리기가 돼서 정책을 수정했다.

### node: --bun is not allowed in NODE_OPTIONS

요약하자면 실행 설정 어딘가에 NODE_OPTIONS로 --bun이라는 값이 들어가 있어 Node.js와 Turbopack이 충돌하고 있는 상황이었다.

Node.js가 난 --bun같은 거 몰라 하고 뻗어버린 것...

bun --bun은 next.js가 내부적으로 node.js 대신 bun 런타임을 강제로 사용하도록 만든다.
이 과정에서 Next.js는 Turbopack을 사용하는데, 해당 빌드 엔진은 일부 로더나 작업을 처리할 때 실제 Node.js를 사용한다.
여기서 Node.js가 실행되어야 할 시점에 Node.js가 --bun을 모른다면 중단되는 것이다.

--bun을 없애면 해결이 된다...

++) gemini 답변
충돌의 핵심: bun --bun 명령어가 실행되는 순간, Bun은 시스템의 NODE_OPTIONS라는 환경 변수에 --bun을 몰래 집어넣음. "앞으로 실행될 모든 Node 프로세스는 나(Bun)처럼 행동해!"라고 명령을 내리는 셈.

Node.js의 거부 반응: 그런데 Next.js(Turbopack)가 내부적으로 "이건 진짜 순수 Node.js가 처리해야 해"라며 특정 작업을 실행할 때, Node.js는 이 환경 변수를 읽게 됩니다. 이때 Node.js 입장에선 "듣도 보도 못한 --bun이라는 옵션이 왜 내 설정에 들어있어?"라며 실행을 거부하고 뻗어버리는 것.

### 하네스 관련

## 참고

[useState를 props로 전달할 때의 타입 선언](https://velog.io/@rkio/Typescript-React-useState%EB%A5%BC-props%EB%A1%9C-%EC%A0%84%EB%8B%AC%ED%95%A0-%EB%95%8C%EC%9D%98-%ED%83%80%EC%9E%85-%EC%84%A0%EC%96%B8)
[이미지 컴포넌트](https://nextjs.org/docs/app/api-reference/components/image#loading)
[url 접근 방지](https://velog.io/@0506phm/Next.jsrouter-url-%EC%A0%91%EA%B7%BC-%EB%B0%A9%EC%A7%80-%EC%8B%9C%EB%8F%84%EA%B8%B0)
