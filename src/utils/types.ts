export enum ModelOrigin {
    GenAI = 'GenAI',
    Local = 'teacher',
    Remote = 'remote',
}

/**
 * Contains top scores for all terms
 * K = term, V = TopResult
 */
export type TopThreeResults = {
    scores: Map<string, TopThree>;
};

// contains top score for single term
export type TopThree = {
    bestScore: Result | null;
    secondScore: Result | null;
    thirdScore: Result | null;
};

export type Result = {
    score: number;
    studentId: string;
};

export type SerializedStudentData = {
    students: [string, { data: [string, number][] }][];
};

export type StudentScore = {
    score?: number;
    topCanvas?: HTMLCanvasElement | null;
    topHeatmap?: HTMLCanvasElement | null;
    hidden: boolean;
};

/**
 * Maps a classifying term to a score (K = classifying term, V = StudentScore)
 */
export type StudentScores = {
    data: Map<string, StudentScore>;
};

export type ModelInfo = {
    origin: ModelOrigin;
    name: string;
};
export type Labels = {
    labels: Map<string, string>;
};

export type SpoofConfig = {
    pause: boolean;
    heatmap: { on: boolean; force: boolean };
    gallery: { on: boolean; force: boolean };
    modelData: ModelInfo;
    gameMode: 'all' | 'single';
    settings: {
        allowHidePicture: boolean;
        allowResetTerm: boolean;
        profilePicture: boolean;
        allowAllLabels: boolean;
    };
};

export type SpoofData = {
    term: string;
    recipient: Username;
};

export type ImageData = {
    studentId: string;
    classname: string;
    image: string | 'delete';
    heatmap: string | 'delete';
    score: number | 'delete';
    hidden: boolean | 'delete';
};
/**
 * Maps a student ID to their scores (K = student ID, V = StudentScores)
 */
export type StudentData = { students: Map<string, StudentScores> };

export type UserInfo = {
    username: string;
    connectionId: string;
};
export type Username = {
    username: string;
};

export type UserItemData = {
    username: string;
    profilePicture: HTMLCanvasElement | null;
};

export type RegisterData = {
    username: string;
    profilePicture: string | null;
};

export type Bouncer = {
    message: string;
    reload: boolean;
};

export type MessageData = {
    message: string;
    reload: boolean;
    action: 'resetResult' | 'bouncer'; // bouncer handles kicking students, resetResults handles resetting result for term
    recipient?: Username;
};

export type Settings = {
    pauseOnChange: boolean;
    allowHidePicture: boolean;
    teacherHideResultPicture: boolean;
    allowStartTermAgain: boolean;
    limitScoreboard: {
        limit: number;
        showAll: boolean;
    };
    userGridSettings: {
        userGridShowCrowns: boolean;
        userGridAutoGrow: boolean;
        userGridMaxColumns: number;
    };
    datasetGallery: {
        allowAllLabels: boolean;
    };
};

/**
 * hidePictures = are pictures sent to teacher hidden by default
 */
export type StudentSettings = {
    hidePictures: boolean;
};

/**
 * Student controls.
 * Dataset view stuff is toggled with different logic as it is also used by teacher
 */
export type StudentControls = {
    pause: boolean;
    heatmap: boolean;
};

/**
 * Default teacher view = leaderboard
 * Default student view = normal view (no other views currently)
 */
export type Views = {
    active: 'none' | TeacherViews;
    overlay: 'none' | TeacherDialogs | StudentDialogs;
};

// Teacher's views
export type TeacherViews =
    | 'userGrid'
    | 'userGridSimple'
    | 'termChange'
    | 'datasetGallery'
    | 'heatmap'
    | 'ready'
    | 'connect'
    | 'select'
    | 'explore'
    | 'data'
    | 'results';

// Teacher's dialogs
export type TeacherDialogs = 'share' | 'modelChange' | 'settings';

// Student's dialogs
export type StudentDialogs = 'ownResults' | 'messageDialog' | 'datasetGallery';

export type ActivityPicture = {
    picture: HTMLCanvasElement;
    hidden: boolean;
};

export type LoadingError = {
    isError: boolean;
    message: string;
    modelInfo: ModelInfo | undefined;
};
