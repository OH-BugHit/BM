const API_BASE_URL = import.meta.env.VITE_APP_API_STORE_URL || '';

export interface FetchImagesParams {
    dataset: string;
    label: string;
}

export async function fetchImages({ dataset, label }: FetchImagesParams): Promise<string[]> {
    const params = new URLSearchParams({
        dataset,
        label,
    });
    console.log(`haetaan kuvia: ${API_BASE_URL}/api/images?${params.toString()}`);
    try {
        const response = await fetch(`${API_BASE_URL}/api/images?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}
