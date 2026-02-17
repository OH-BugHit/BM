import TMClassifier from '@genai-fi/classifier';
import { ModelInfo, ModelOrigin } from '../utils/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_SHARE_BASE_URL = import.meta.env.VITE_API_SHARE_BASE_URL;

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

// Needs delay as the config will be received by student before the model sharing is activated
export async function fetchModelFromURLStudent(sessionCode: string): Promise<Blob | null> {
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 500;
    const MAX_DELAY = 3000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(`${API_SHARE_BASE_URL}/model/${sessionCode}/project.zip`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES - 1;

            if (isLastAttempt) {
                console.error('Error fetching model after retries:', error);
                return null;
            }

            // Exponential backoff with jitter
            const delay = Math.min(INITIAL_DELAY * Math.pow(2, attempt) + Math.random() * 100, MAX_DELAY);
            console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay.toFixed(0)}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    return null;
}

export async function loadSharedModel(sessionCode: string): Promise<TMClassifier | null> {
    const modelFile = await fetchModelFromURLStudent(sessionCode);
    if (modelFile) {
        return await TMClassifier.load(modelFile);
    } else {
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
