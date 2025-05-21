// src/utils/classifyImage.ts
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

/**
 * Imageclassifier function using MobileNet model.
 * This function takes an image element or URL and classifies it using the provided MobileNet model.
 * @param model Movbilenet model for image classification
 * @param input Image element or URL to classify
 * @returns Classification results
 */
export async function classifyImage(model: mobilenet.MobileNet, input: HTMLImageElement | HTMLCanvasElement | string) {
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

    return model.classify(element);
}
