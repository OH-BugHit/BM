import { useRef, useEffect } from 'react';

type CanvasCopyProps = {
    sourceCanvas: HTMLCanvasElement | null | undefined;
    maxWidth?: number;
    shape?: 'round' | 'leftRound' | 'squircle';
    width?: number;
    height?: number;
};

export function CanvasCopy({ sourceCanvas, maxWidth = 160, shape, width, height }: CanvasCopyProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    const canvasStyle: React.CSSProperties = {
        maxWidth,
        width,
        height,
        border: '1px solid #ccc',
        display: 'block',
        aspectRatio: shape === 'round' ? '1 / 1' : undefined,
        borderRadius: shape === 'round' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
        borderTopLeftRadius: shape === 'leftRound' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
        borderBottomLeftRadius: shape === 'leftRound' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
    };

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
    if (sourceCanvas === undefined) return;
    return (
        <canvas
            ref={ref}
            style={canvasStyle}
        />
    );
}
