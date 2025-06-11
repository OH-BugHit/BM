export type Score = {
    className: string;
    lowScore: number;
    topScore: number;
    topCanvas: HTMLCanvasElement | null;
    topHeatmap: HTMLCanvasElement | null;
};

type StudentScore = {
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

export type SpoofConfig = { data: string }; // Jatka change null
export type ScoreData = { classname: string; score: number };
export type ImageData = { classname: string; image: string; heatmap: string }; // TODO: Vaihda imaget
/**
 * Maps a student ID to their scores (K = student ID, V = StudentScores)
 */
export type StudentData = { students: Map<string, StudentScores> };
