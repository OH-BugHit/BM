import { atom } from 'jotai';

export const testAtom = atom(0);

export const imageAtom = atom<HTMLCanvasElement | null>(null);
