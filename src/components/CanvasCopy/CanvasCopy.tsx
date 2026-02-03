import { useRef, useEffect } from 'react';

type CanvasCopyProps = {
    sourceCanvas: HTMLCanvasElement | null | undefined;
    maxWidth?: number;
    maxHeight?: number;
    shape?: 'round' | 'leftRound' | 'squircle';
    width?: number | string;
    height?: number | string;
    noBorder?: boolean;
};

export function CanvasCopy({
    sourceCanvas,
    maxWidth = 160,
    maxHeight = 160,
    shape,
    width,
    height,
    noBorder,
}: CanvasCopyProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    const canvasStyle: React.CSSProperties = {
        maxWidth,
        maxHeight,
        width,
        height,
        border: noBorder ? 'none' : '1px solid #ccc',
        display: 'block',
        aspectRatio: shape === 'round' ? '1 / 1' : undefined,
        borderRadius: shape === 'round' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
        borderTopLeftRadius: shape === 'leftRound' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
        borderBottomLeftRadius: shape === 'leftRound' ? '50%' : shape === 'squircle' ? '1rem' : undefined,
        objectFit: 'contain',
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
