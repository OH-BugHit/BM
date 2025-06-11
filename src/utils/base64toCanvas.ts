export async function base64ToCanvas(base64: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            } else {
                reject(new Error('Canvas context not available'));
            }
        };
        img.onerror = reject;
        img.src = base64;
    });
}
