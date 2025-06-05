// import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';
import TMClassifier from '@genai-fi/classifier';

export async function loadModel() {
    // const model = await mobilenet.load(); // mobilenetin luokittelija
    //const model = TMClassifier.load('/testModels/testimalli1.zip');
    const model = TMClassifier.load('/testModels/EinonMalli.zip');
    return model;
}
