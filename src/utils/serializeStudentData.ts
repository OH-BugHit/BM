import { StudentData, StudentScores, StudentScore, SerializedStudentData } from './types';

/**
 * We want to save only scores to sessionStorage, no canvases or hidden values.,
 */
export function serializeStudentData(studentData: StudentData): SerializedStudentData {
    return {
        students: Array.from(studentData.students.entries()).map(([id, scores]) => [
            id,
            {
                data: Array.from(scores.data.entries()).map(([key, score]) => [key, score.score ?? 0]),
            },
        ]),
    };
}

/**
 * Restores the StudentData from session storage
 */
export function deserializeStudentData(raw: SerializedStudentData): StudentData {
    return {
        students: new Map(
            raw.students.map(([id, scores]) => [
                id,
                {
                    data: new Map(
                        scores.data.map(([key, score]) => [
                            key,
                            {
                                score,
                                topCanvas: null,
                                topHeatmap: null,
                                hidden: false,
                            } as StudentScore,
                        ])
                    ),
                } as StudentScores,
            ])
        ),
    };
}
