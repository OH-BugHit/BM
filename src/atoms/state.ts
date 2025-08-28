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
    StudentControls,
    Views,
    StudentSettings,
    ActivityPicture,
    Labels,
} from '../utils/types';

/**
 * Convains info of active view and ovelay
 */
export const activeViewAtom = atom<Views>({ active: 'default', overlay: 'none' });

/**
 * Current model
 */
export const modelAtom = atom<ClassifierApp | null>(null);

/**
 * Contains translations
 */
export const labelsAtom = atom<Labels>({ labels: new Map() });

/**
 * List of models available at GenAI Store
 */
export const modelListAtom = atom<string[]>([]);

/**
 * Contains configuration of the game
 * Teacher can send new configuration by modifying this atom
 */
export const configAtom = atom<SpoofConfig>({
    pause: false,
    heatmap: false,
    gallery: false,
    modelData: { origin: ModelOrigin.GenAI, name: '' },
    gameMode: 'all',
    settings: {
        allowHidePicture: true,
        allowResetTerm: true,
        profilePicture: false,
    },
});

/**
 * Teacher can send classifying term by modifying this atom
 * if recipient: username === 'a', every student changes to this term
 */
export const termTransferAtom = atom<SpoofData>({
    term: '',
    recipient: { username: 'a' },
});

/**
 * Teacher can send messages by updating this atom
 */
export const messageTransferAtom = atom<MessageData>({
    message: '',
    reload: false,
    action: 'bouncer',
    recipient: { username: '' },
});

/**
 * Contains game data from students (top results)
 */
export const studentDataAtom = atom<StudentData>({ students: new Map() });

/**
 * List of active players
 */
export const usersAtom = atom<UserInfo[]>([]);

/**
 * All player names
 */
export const takenUsernamesAtom = atom<Username[]>([]);

/* Users that have left the session (for returning player). Only used by student*/
export const availableUsernamesAtom = atom<Username[]>([]);

/**
 * Contains students own username
 * Only used by student
 */
export const usernameAtom = atom<string>('');

/**
 * Contains students own profilepicture
 * Only used by student
 */
export const profilePictureAtom = atom<string | null>(null);

/**
 * Controls students game and can set messages for player by teacher.
 * Reload = true will kick student from session by reloading the page.
 * Only used by student
 */
export const studentBouncerAtom = atom<Bouncer>({ message: '', reload: false });

/**
 * Contains profile pictures in map for teacher
 * K= username, V: picture
 */
export const profilePicturesAtom = atom<Map<string, HTMLCanvasElement>>(new Map());

/**
 * Contains the current word for everyone.
 * Used only by teacher
 */
export const selectedTermAtom = atom<string>('');

/**
 * Contains selected user in usergrid view
 * Only used by teacher
 */
export const selectedUserAtom = atom<UserItemData>({ username: '', profilePicture: null });

/**
 * Contains students own results
 * Only used by student
 */
export const studentResultsAtom = atom<StudentScores>({ data: new Map() });

/**
 * //TODO: Include profilePicture needed
 * Contains game settings
 * Only used by teacher
 */
export const settingAtom = atom<Settings>({
    pauseOnChange: false,
    allowHidePicture: true,
    teacherHideResultPicture: false,
    allowStartTermAgain: true,
    limitScoreboard: { limit: 2, showAll: false },
});

export const studentSettingsAtom = atom<StudentSettings>({
    hidePictures: false,
});

/**
 * modelDataAtom is used for storing the model-file uploaded by the teacher.
 * This file is sent to the student at model request event.
 */
export const modelDataAtom = atom<File | null>(null);

/**
 * Contains information, which pictures should be hidden from scoreboard
 * K = student, V = list of classnames for pictures to be hidden (by teacher).
 */
export const teacherHidesAtom = atom<Map<string, string[]>>(new Map());

/**
 * Contains last received top images shown at user grid view
 * K = students name (username) V = last image receiced
 */
export const studentActivityAtom = atom<Map<string, ActivityPicture | null>>(new Map());

/**
 * Contains data of student's selected controls.
 * Dataset view stuff is toggled with different logic as the same component is also used by teacher
 */
export const studentControlsAtom = atom<StudentControls>({ pause: false, heatmap: false });
