import { ModelInfo } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface FetchImageUrlsParams {
    dataset: ModelInfo;
}

export async function fetchImageUrls({ dataset }: FetchImageUrlsParams): Promise<Record<string, string[]>> {
    try {
        const response = await fetch(`${API_BASE_URL}/spoof/${dataset.name}/${dataset.name}.json`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const dataJSON = await response.json();
        const result: Record<string, string[]> = {};
        for (const label in dataJSON.labels) {
            const allFiles = dataJSON.labels[label];
            const lowerLabel = label.toLowerCase();
            result[label] = allFiles.thumbnails.map(
                (filename: string) => `${API_BASE_URL}/spoof/${dataset.name}/${lowerLabel}/${filename}`
            );
        }

        return result;
    } catch (error) {
        console.error('Error fetching image Urls:', error);
        return {};
    }
}
