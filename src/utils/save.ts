export function mergeCanvases(
    left?: HTMLCanvasElement | null,
    right?: HTMLCanvasElement | null
): HTMLCanvasElement | null {
    if (!left && !right) return null;

    const width = (left?.width ?? 0) + (right?.width ?? 0);
    const height = Math.max(left?.height ?? 0, right?.height ?? 0);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (left) ctx.drawImage(left, 0, 0);
    if (right) ctx.drawImage(right, left?.width ?? 0, 0);

    return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
        }, 'image/png');
    });
}
