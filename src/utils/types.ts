export type StudentScore = {
    score?: number;
    topCanvas?: HTMLCanvasElement | null;
    topHeatmap?: HTMLCanvasElement | null;
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
};

export type SpoofData = {
    term: string;
    recipient: Username;
};

export type ImageData = {
    studentId: string;
    classname: string;
    image: string;
    heatmap: string;
    score: number;
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
    profilePicture: string;
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
    recipient?: Username;
};
