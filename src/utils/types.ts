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

export type SpoofConfig = {
    pause: boolean;
    heatmap: boolean;
    gallery: boolean;
    modelData: ModelInfo;
    gameMode: 'all' | 'single';
    settings: {
        allowHidePicture: boolean;
        allowResetTerm: boolean;
        profilePicture: boolean;
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
}; // TODO: Vaihda imaget
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

export enum ModelOrigin {
    GenAI = 'Gen-AI',
    Local = 'local',
    Teacher = 'teacher',
    Default = 'default',
}

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
};
