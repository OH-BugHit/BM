export function canvasToBase64(canvas: HTMLCanvasElement, type = 'image/png', quality?: number): string {
    return canvas.toDataURL(type, quality);
}
