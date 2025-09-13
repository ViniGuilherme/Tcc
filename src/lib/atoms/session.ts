import type { User } from "@/types/user";
import { atom } from "jotai";

export const sessionAtom = atom<User | null>(null);