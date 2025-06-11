// Komponentti, joka kopioi annetun canvasin sisällön näkyvään canvas-elementtiin
import { useRef, useEffect } from 'react';

export function CanvasCopy({ sourceCanvas }: { sourceCanvas: HTMLCanvasElement }) {
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
            style={{ maxWidth: 160, border: '1px solid #ccc' }}
        />
    );
}
