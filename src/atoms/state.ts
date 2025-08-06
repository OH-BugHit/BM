import { atom } from 'jotai';
import ClassifierApp from '@genai-fi/classifier';
import {
    Bouncer,
    ModelOrigin,
    SpoofConfig,
    SpoofData,
    StudentData,
    UserInfo,
    Username,
    UserItemData,
    MessageData,
} from '../utils/types';

export type Scores = {
    className: string;
    lowScore: number;
    topScore: number;
    topCanvas: HTMLCanvasElement | null;
    topHeatmap: HTMLCanvasElement | null;
}[];

export const imageAtom = atom<HTMLCanvasElement | null>(null);

export const imageCacheAtom = atom<{ [filename: string]: string }>({});

export const currentImageAtom = atom<string>('');

export const modelAtom = atom<ClassifierApp | null>(null);

export const classificationResultAtom = atom<{ className: string; probability: number }[] | null>(null);

export const modelListAtom = atom<string[]>([]);

export const configAtom = atom<SpoofConfig>({
    pause: false,
    heatmap: false,
    gallery: false,
    modelData: { origin: ModelOrigin.GenAI, name: '' },
    gameMode: 'all',
});

export const termTransferAtom = atom<SpoofData>({
    term: '',
    recipient: { username: 'a' },
});

export const messageTransferAtom = atom<MessageData>({
    message: '',
    reload: false,
    recipient: { username: '' },
});

export const scoresAtom = atom<Scores>([]);

export const studentDataAtom = atom<StudentData>({ students: new Map() });

export const usersAtom = atom<UserInfo[]>([]);

export const takenUsernamesAtom = atom<Username[]>([]);

/*Users that have left the session*/
export const availableUsernamesAtom = atom<Username[]>([]);

export const usernameAtom = atom<string>('');

export const profilePictureAtom = atom<string>('');

/**
 * Controls single user. Reload = true will kick student from session by reloading the page.
 */
export const studentBouncerAtom = atom<Bouncer>({ message: '', reload: false });

/**
 * K= username, V: picture
 */
export const profilePicturesAtom = atom<Map<string, HTMLCanvasElement>>(new Map());

/**
 * Contains the current word for everyone. (used by teachers components) or current term for student (used by student components)
 */
export const selectedTermAtom = atom<string>('');

export const selectedUserAtom = atom<UserItemData>({ username: '', profilePicture: null });

/**
 * Following atoms are used to store what component is shown.
 */
export const menuShowShareAtom = atom<boolean>(false);
export const menuShowTrainingDataAtom = atom<boolean>(false);
export const menuShowModelChangeAtom = atom<boolean>(false);
export const menuShowUsersAtom = atom<boolean>(false);
export const menuShowCategoryViewAtom = atom<boolean>(true);
export const menuShowTermChangeAtom = atom<boolean>(false);

export const showUserTermDialogAtom = atom<boolean>(false);

/**
 * modelDataAtom is used for storing the model file uploaded by the teacher. This file is sent to the student at request.
 */
export const modelDataAtom = atom<File | null>(null);
