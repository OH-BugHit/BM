const API_BASE_URL = import.meta.env.VITE_APP_API_STORE_URL || '';

export async function fetchModelNames(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/static/modelNames.json`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const dataJSON = await response.json();
        return dataJSON.names;
    } catch (error) {
        console.error('Error fetching model names:', error);
        return [];
    }
}

export interface FetchImageUrlsParams {
    dataset: string;
}

export async function fetchImageUrls({ dataset }: FetchImageUrlsParams): Promise<Record<string, string[]>> {
    try {
        const response = await fetch(`${API_BASE_URL}/static/${dataset}.json`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const dataJSON = await response.json();

        // Oletetaan että dataJSON.labels on muotoa { [label: string]: string[] }
        const result: Record<string, string[]> = {};
        for (const label in dataJSON.labels) {
            const allFiles = dataJSON.labels[label];
            result[label] = allFiles.map((filename: string) => `/static/${dataset}/${label}/${filename}`);
        }

        return result;
    } catch (error) {
        console.error('Error fetching image Urls:', error);
        return {};
    }
}
