import { atom } from 'jotai';
import ClassifierApp from '@genai-fi/classifier';
import { SpoofConfig, StudentData } from '../utils/types';

export type Scores = {
    className: string;
    lowScore: number;
    topScore: number;
    topCanvas: HTMLCanvasElement | null;
    topHeatmap: HTMLCanvasElement | null;
}[];

//TODO: MOVE TO TYPES WHEN READY
export type UserInfo = {
    username: string;
    connectionId: string;
};

export type Username = {
    username: string;
};

export const imageAtom = atom<HTMLCanvasElement | null>(null);

export const imageCacheAtom = atom<{ [filename: string]: string }>({});

export const currentImageAtom = atom<string>('');

export const modelAtom = atom<ClassifierApp | null>(null);

export const classificationResultAtom = atom<{ className: string; probability: number }[] | null>(null);

export const configAtom = atom<SpoofConfig>({ data: '', pause: false });

export const scoresAtom = atom<Scores>([]);

export const studentDataAtom = atom<StudentData>({ students: new Map() });

export const usersAtom = atom<UserInfo[]>([]);

export const usernamesAtom = atom<Username[]>([]);

export const availableUsernamesAtom = atom<Username[]>([]);

export const usernameAtom = atom<string>('');

export const menuShowShareAtom = atom<boolean>(false);

export const menuShowTrainingDataAtom = atom<boolean>(false);
