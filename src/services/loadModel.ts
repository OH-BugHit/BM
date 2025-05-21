import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export async function loadMobileNetModel() {
    await tf.setBackend('webgl'); // Varmistetaan backend
    await tf.ready(); // Odotetaan että se on käyttövalmis
    const model = await mobilenet.load();
    return model;
}
