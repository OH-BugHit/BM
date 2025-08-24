// Utility to clone a canvas and its contents
export function cloneCanvas(oldCanvas: HTMLCanvasElement | null): HTMLCanvasElement | null {
    if (!oldCanvas) return null;
    const newCanvas = document.createElement('canvas');
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    const ctx = newCanvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(oldCanvas, 0, 0);
    }
    return newCanvas;
}
