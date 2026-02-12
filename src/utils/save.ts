const HEATMAP_DEFAULT_SIZE = 224;

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

/**
 * Upscale a canvas to match the dimensions of a reference canvas.
 * Useful for resizing heatmap overlays to match the original image size.
 * @param source The canvas to upscale (e.g., heatmap)
 * @param reference The reference canvas to match dimensions with (e.g., original image)
 * @returns A new canvas with upscaled content, or null if inputs are invalid
 */
export function upscaleCanvasToSameSize(
    source?: HTMLCanvasElement | null,
    reference?: HTMLCanvasElement | null
): HTMLCanvasElement | null {
    if (!source || !reference) return null;

    const targetWidth = reference.width;
    const targetHeight = reference.height;

    // If dimensions already match, return the source as-is
    if (source.width === targetWidth && source.height === targetHeight) {
        return source;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw the source canvas, scaled to fill the target dimensions
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

    return canvas;
}

export function splitCanvasVertically(source?: HTMLCanvasElement | null): {
    topCanvas: HTMLCanvasElement | null;
    topHeatmap: HTMLCanvasElement | null;
} {
    if (!source) return { topCanvas: null, topHeatmap: null };
    const splitAt = Math.floor(source.width / 2);

    const topScoreCanvas = document.createElement('canvas');
    topScoreCanvas.width = splitAt;
    topScoreCanvas.height = source.height;

    const heatMapCanvas = document.createElement('canvas');
    heatMapCanvas.width = HEATMAP_DEFAULT_SIZE;
    heatMapCanvas.height = HEATMAP_DEFAULT_SIZE;

    const leftCtx = topScoreCanvas.getContext('2d');
    const rightCtx = heatMapCanvas.getContext('2d');

    if (!leftCtx || !rightCtx) return { topCanvas: null, topHeatmap: null };

    leftCtx.drawImage(source, 0, 0, splitAt, source.height);
    rightCtx.drawImage(source, splitAt, 0, source.width - splitAt, source.height);

    return { topCanvas: topScoreCanvas, topHeatmap: heatMapCanvas };
}

export function downScaleCanvasToSize(
    source?: HTMLCanvasElement | null,
    targetWidth: number = HEATMAP_DEFAULT_SIZE,
    targetHeight: number = HEATMAP_DEFAULT_SIZE
): HTMLCanvasElement | null {
    if (!source) return null;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // Draw the source canvas, scaled to the target dimensions
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    return canvas;
}

/**
 * Split a merged canvas into left and right parts, and downscale the heatMapCanvas part.
 * Used when loading saved game state where images are merged.
 * @param merged The merged canvas (left + right side by side)
 * @param leftWidth The width of the left (normal image) part
 * @returns Object with left canvas and right canvas (downscaled to HEATMAP_DEFAULT_SIZE)
 */
export function splitAndDownscaleHeatmap(merged: HTMLCanvasElement): {
    topCanvas: HTMLCanvasElement;
    topHeatmap: HTMLCanvasElement | null;
} {
    const normalWidth = merged.width / 2;
    const height = merged.height;

    // Split left part
    const leftCanvas = document.createElement('canvas');
    leftCanvas.width = normalWidth;
    leftCanvas.height = height;
    const leftCtx = leftCanvas.getContext('2d');
    if (leftCtx) {
        leftCtx.drawImage(merged, 0, 0, normalWidth, height, 0, 0, normalWidth, height);
    }

    // Split right part
    const rightCanvas = document.createElement('canvas');
    rightCanvas.width = normalWidth;
    rightCanvas.height = height;
    const rightCtx = rightCanvas.getContext('2d');
    if (rightCtx) {
        rightCtx.drawImage(merged, normalWidth, 0, normalWidth, height, 0, 0, normalWidth, height);
    }

    // Downscale right part (heatmap) to HEATMAP_DEFAULT_SIZE
    const downscaledRight = downScaleCanvasToSize(rightCanvas, HEATMAP_DEFAULT_SIZE, HEATMAP_DEFAULT_SIZE);

    return { topCanvas: leftCanvas, topHeatmap: downscaledRight };
}
