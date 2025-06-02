// src/utils/classifyImage.ts
import ClassifierApp from '@genai-fi/classifier';
import '@tensorflow/tfjs';

/**
 * Imageclassifier function using MobileNet model.
 * This function takes an image element or URL and classifies it using the provided MobileNet model.
 * @param model Movbilenet model for image classification
 * @param input Image element or URL to classify
 * @param topK Number of top results to return, default is 3
 * @returns Classification results
 */
export async function classifyImage(model: ClassifierApp, input: HTMLImageElement | HTMLCanvasElement | string) {
    //TODO: Modify input image to -> HTMLCanvasElement if it is not
    let element: HTMLImageElement | HTMLCanvasElement;

    if (typeof input === 'string') {
        element = new Image();
        element.crossOrigin = 'anonymous';
        element.src = input;

        await new Promise<void>((resolve, reject) => {
            element.onload = () => resolve();
            element.onerror = () => reject(new Error('Kuvan lataus epäonnistui'));
        });
    } else {
        element = input;
    }

    if (model instanceof ClassifierApp && element instanceof HTMLCanvasElement) {
        return model.predict(element);
    } else {
        return null;
    }
}
