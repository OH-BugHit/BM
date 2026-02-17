import TMClassifier from '@genai-fi/classifier';
import { ModelInfo, ModelOrigin } from '../utils/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function fetchModelFromGenAI(name: string): Promise<Blob | null> {
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

export async function fetchModelFromURL(url: string): Promise<Blob | null> {
    try {
        const response = await fetch(`${url}`);
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

/**
 *
 * This function loads model. Local model loading is only for teacher and that is for local file. fetchLocalModelFromURL is for student.
 * @returns
 */
export async function loadModel({ name, origin }: ModelInfo) {
    if (origin === ModelOrigin.GenAI) {
        const modelFile = await fetchModelFromGenAI(name);
        if (modelFile) {
            return await TMClassifier.load(modelFile);
        } else return null;
    } else if (origin === ModelOrigin.Local) {
        return await TMClassifier.load(name);
    } else if (origin === ModelOrigin.Remote) {
        const modelFile = await fetchModelFromURL(name);
        if (modelFile) {
            return await TMClassifier.load(modelFile);
        } else return null;
    } else {
        console.log('model loading from origin', origin, 'not implemented');
        return null;
    }
}

interface LabelProps {
    language: string;
    modelName: string;
}

export async function loadLabels({ language, modelName }: LabelProps) {
    try {
        const labels = await fetch(`${API_BASE_URL}/spoof/${modelName}/_locals/${language}.json`);
        if (!labels.ok) {
            throw new Error(`Server error: ${labels.status}`);
        }
        const dataJSON = await labels.json();
        return dataJSON;
    } catch (error) {
        console.error('Error fetching labels', error);
        return null;
    }
}
