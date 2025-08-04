// Komponentti, joka kopioi annetun canvasin sisällön näkyvään canvas-elementtiin
import { useRef, useEffect } from 'react';

type CanvasCopyProps = {
    sourceCanvas: HTMLCanvasElement | null;
    maxWidth?: number;
};

export function CanvasCopy({ sourceCanvas, maxWidth = 160 }: CanvasCopyProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (ref.current && sourceCanvas) {
            ref.current.width = sourceCanvas.width;
            ref.current.height = sourceCanvas.height;
            const ctx = ref.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, ref.current.width, ref.current.height);
                ctx.drawImage(sourceCanvas, 0, 0);
            }
        }
    }, [sourceCanvas]);

    return (
        <canvas
            ref={ref}
            style={{ maxWidth: maxWidth, border: '1px solid #ccc' }}
        />
    );
}
