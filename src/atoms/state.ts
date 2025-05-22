import { atom } from 'jotai';
import * as mobilenet from '@tensorflow-models/mobilenet';

export const imageAtom = atom<HTMLCanvasElement | null>(null);

export const imageCacheAtom = atom<{ [filename: string]: string }>({});

export const currentImageAtom = atom<string>('');

export const modelAtom = atom<mobilenet.MobileNet | null>(null);

export const classificationResultAtom = atom<{ className: string; probability: number }[] | null>(null);

export const scoresAtom = atom<{ className: string; lowScore: number; topScore: number }[]>([]);
