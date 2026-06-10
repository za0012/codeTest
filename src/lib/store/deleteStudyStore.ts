import { atomWithStorage } from "jotai/utils";

export const deleteStudyAtom = atomWithStorage<string | null>(
  "Deletebanner",
  null,
);
