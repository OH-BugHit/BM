import { atom } from 'jotai';
import ClassifierApp from '@genai-fi/classifier';
import { SpoofConfig } from '../utils/types';

export const imageAtom = atom<HTMLCanvasElement | null>(null);

export const imageCacheAtom = atom<{ [filename: string]: string }>({});

export const currentImageAtom = atom<string>('');

export const modelAtom = atom<ClassifierApp | null>(null);

export const classificationResultAtom = atom<{ className: string; probability: number }[] | null>(null);

export const configAtom = atom<SpoofConfig>({ data: 'notSet' });

export const scoresAtom = atom<
    {
        className: string;
        lowScore: number;
        topScore: number;
        topCanvas: HTMLCanvasElement | null;
        topHeatmap: HTMLCanvasElement | null;
    }[]
>([]);
