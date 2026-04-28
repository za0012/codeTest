import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface User {
  email: string;
  email_verified: boolean; //이거 안 들어가게 해야함
  emoji: string;
  name: string;
  phone_verified: boolean; //이거 안 들어가게 해야함
  sub: string; //이거 안 들어가게 해야함
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const authBaseAtom = atomWithStorage<AuthState>("auth_storage", {
  user: null,
  token: null,
});

export const isLoggedAtom = atom((get) => {
  const auth = get(authBaseAtom);
  return !!auth.token;
});

export const authActionAtom = atom(
  null, // 첫 번째 인자는 읽기(get) 용도이나 여기선 사용 안 함
  (
    get,
    set,
    action: { type: "LOGIN"; payload: AuthState } | { type: "LOGOUT" },
  ) => {
    if (action.type === "LOGIN") {
      set(authBaseAtom, action.payload);
    } else if (action.type === "LOGOUT") {
      // 초기 상태로 리셋
      set(authBaseAtom, { user: null, token: null });
      // 필요 시 localStorage.clear() 대신 명시적으로 초기값 세팅 권장
    }
  },
);

export const userAtom = atom((get) => get(authBaseAtom));
// 이런 식으로 읽고 쓰고할 수 있는 원자를 생성할 수 있다.
// export const nicknameAtom = atom("");
// export const nicknameAtom = atom("");
//useAtomValue와 useUpdateAtom은 읽기나 쓰기 중 하나만 필요할 때 사용가능한 유틸리티 함수입니다.
