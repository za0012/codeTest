import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Study } from "../types/study";

const studyAtom = atomWithStorage<Study>("study_storage", {
  created_at: null,
  description: null,
  emoji: null,
  id: null,
  invite_code: null,
  name: null,
});

//Write-only Atom (액션)
export const studyActionAtom = atom(
  null, // 첫 번째 인자는 읽기(get) 용도이나 여기선 사용 안 함
  (_, set, payload: Study) => set(studyAtom, payload),
);

export const useStudyAtom = atom((get) => get(studyAtom));
// 이런 식으로 읽고 쓰고할 수 있는 원자를 생성할 수 있다.

// const readOnlyAtom = atom((get) => get(priceAtom) * 2)
// const writeOnlyAtom = atom(
//   null, // it's a convention to pass `null` for the first argument
//   (get, set, update) => {
//     // `update` is any single value we receive for updating this atom
//     set(priceAtom, get(priceAtom) - update.discount)
//     // or we can pass a function as the second parameter
//     // the function will be invoked,
//     //  receiving the atom's current value as its first parameter
//     set(priceAtom, (price) => price - update.discount)
//   },
// )
// const readWriteAtom = atom(
//   (get) => get(priceAtom) * 2,
//   (get, set, newPrice) => {
//     set(priceAtom, newPrice / 2)
//     // you can set as many atoms as you want at the same time
//   },
// )

// export const nicknameAtom = atom("");
// export const nicknameAtom = atom("");
//useAtomValue와 useUpdateAtom은 읽기나 쓰기 중 하나만 필요할 때 사용가능한 유틸리티 함수입니다.
