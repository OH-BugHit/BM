const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchModelNames(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/spoof/modelNames.json`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const dataJSON = await response.json();
        return dataJSON.names;
    } catch (error) {
        console.error('Error fetching model names:', error);
        throw new Error(`Server error`);
    }
}
