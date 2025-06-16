/**
 * Validates webcam image by checking if the canvas contains a non transparen pixel at 0,0 position
 * @param canvas Input canvas element to validate
 * @returns Returns true if the cancas contains valid image (not transparent), otherwise false
 */
export function validateCanvas(canvas: HTMLCanvasElement): boolean {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        if (pixel[3] === 0) {
            return false;
        }
        return true;
    }
    return false;
}
