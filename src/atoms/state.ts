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
    Settings,
    StudentScores,
} from '../utils/types';

export const modelAtom = atom<ClassifierApp | null>(null);

export const classificationResultAtom = atom<{ className: string; probability: number }[] | null>(null);

export const modelListAtom = atom<string[]>([]);

export const configAtom = atom<SpoofConfig>({
    pause: false,
    heatmap: false,
    gallery: false,
    modelData: { origin: ModelOrigin.GenAI, name: '' },
    gameMode: 'all',
    settings: {
        allowHidePicture: true,
        allowResetTerm: true,
    },
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

export const studentDataAtom = atom<StudentData>({ students: new Map() });

export const usersAtom = atom<UserInfo[]>([]);

export const takenUsernamesAtom = atom<Username[]>([]);

/*Users that have left the session*/
export const availableUsernamesAtom = atom<Username[]>([]);

/**
 * Contains students username
 */
export const usernameAtom = atom<string>('');

/**
 * Contains students own profilepicture
 */
export const profilePictureAtom = atom<string>('');

/**
 * Controls students game. Reload = true will kick student from session by reloading the page.
 */
export const studentBouncerAtom = atom<Bouncer>({ message: '', reload: false });

/**
 * Contains profile pictures in map for teacher
 * K= username, V: picture
 */
export const profilePicturesAtom = atom<Map<string, HTMLCanvasElement>>(new Map());

/**
 * Contains the current word for everyone. (used by teachers components) or current term for student (used by student components)
 */
export const selectedTermAtom = atom<string>('');

/**
 * Contains selected user in usergrid view
 */
export const selectedUserAtom = atom<UserItemData>({ username: '', profilePicture: null });

/**
 * Following atoms are used to store what component is shown.
 */
export const menuShowShareAtom = atom<boolean>(false);
export const menuShowTrainingDataAtom = atom<boolean>(false);
export const menuShowModelChangeAtom = atom<boolean>(false);
export const menuShowUserGridAtom = atom<boolean>(false);
export const menuShowLeaderboardAtom = atom<boolean>(true);
export const menuShowTermChangeAtom = atom<boolean>(false);

export const showUserTermDialogAtom = atom<boolean>(false);
export const showSettingsDialogAtom = atom<boolean>(false);
export const showOwnResultsAtom = atom<boolean>(false);

export const studentResultsAtom = atom<StudentScores>({ data: new Map() });

/**
 * //TODO: Include all settings and do settings for teacher
 */
export const settingAtom = atom<Settings>({
    pauseOnChange: false,
    allowHidePicture: true,
    teacherHideResultPicture: false,
    allowStartTermAgain: true,
    limitScoreboard: { limit: 2, showAll: false },
});

/**
 * modelDataAtom is used for storing the model file uploaded by the teacher. This file is sent to the student at request.
 */
export const modelDataAtom = atom<File | null>(null);
