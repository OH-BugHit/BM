import TMClassifier from '@genai-fi/classifier';
import { ModelInfo, ModelOrigin } from '../utils/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function fetchModel(name: string): Promise<Blob | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/spoof/${name}/${name}.zip`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error fetching model:', error);
        return null;
    }
}

export async function loadModel({ name, origin }: ModelInfo) {
    console.log('ladataan malli', name, origin);
    if (origin === ModelOrigin.GenAI) {
        const modelFile = await fetchModel(name);
        if (modelFile) {
            return await TMClassifier.load(modelFile);
        } else return null;
    } else if (origin === ModelOrigin.Local) {
        return await TMClassifier.load(name);
    } else if (origin === ModelOrigin.Teacher) {
        console.log('ladataan malli Teacher');
        return await TMClassifier.load(name);
    } else {
        return await TMClassifier.load('/testModels/testimalli1.zip');
    }
}
