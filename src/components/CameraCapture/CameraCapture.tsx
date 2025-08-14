import { useCallback, useState } from 'react';
import { Webcam, Button } from '@genai-fi/base';

interface Props {
    onCapture: (img: HTMLCanvasElement) => void;
    onDone: () => void;
}
// Ei käytössä tällä hetkellä, mutta voi olla hyödyllinen tulevaisuudessa
/**
 * CameraCapture komponent for capturing images from the webcam
 * @param param0 - onCapture: function to call when an image is captured
 * @returns Component for capturing image from the webcam
 */
export default function CameraCapture({ onCapture, onDone }: Props) {
    const [capture, setCapture] = useState(false);

    const handleImage = useCallback(
        (img: HTMLCanvasElement) => {
            onCapture(img);
            onDone();
        },
        [onCapture, onDone]
    );

    return (
        <>
            <Webcam
                size={224}
                interval={1000} // yhden kuvan ottaminen tarvitaan vaan, kysele Nickiltä miten tehdään
                onCapture={handleImage}
                capture={capture}
            />
            <Button
                onMouseDown={() => setCapture(true)}
                onMouseUp={() => setCapture(false)}
                onBlur={() => setCapture(false)}
                onMouseLeave={() => setCapture(false)}
                onTouchEnd={() => setCapture(false)}
                onTouchCancel={() => setCapture(false)}
            >
                Ota kuva
            </Button>
        </>
    );
}
