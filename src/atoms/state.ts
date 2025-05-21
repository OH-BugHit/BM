import { atom } from 'jotai';
import * as mobilenet from '@tensorflow-models/mobilenet';

export const testAtom = atom(0);

export const imageAtom = atom<HTMLCanvasElement | null>(null);

export const imageCacheAtom = atom<{ [filename: string]: string }>({});

export const currentImageAtom = atom<string>('');

export const modelAtom = atom<mobilenet.MobileNet | null>(null);
