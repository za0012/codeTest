import { atom } from "jotai";
import type { modalProps } from "@/components/ui/Modal";

export const modalAtom = atom<modalProps | null>(null);
