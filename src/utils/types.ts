export type Score = {
    className: string;
    lowScore: number;
    topScore: number;
    topCanvas: HTMLCanvasElement | null;
    topHeatmap: HTMLCanvasElement | null;
};

export type SpoofConfig = { data: string }; // Jatka change null
export type ScoreData = { classname: string; score: number }; // Siirrä types
export type ImageData = { classname: string; image: string; heatmap: string }; // TODO: Vaihda imaget
