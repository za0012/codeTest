import { atom } from "jotai";
import type { alertType } from "@/components/AlertCustom";

export const alertAtom = atom<alertType | null>(null);
