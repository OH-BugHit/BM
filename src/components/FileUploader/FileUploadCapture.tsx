import { ChangeEvent, useCallback } from 'react';

interface Props {
    onCapture: (img: HTMLCanvasElement) => void;
    onDone: () => void;
}

export default function FileUploadCapture({ onCapture, onDone }: Props) {
    const handleFileUpload = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = 224;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, size, size);
                        onCapture(canvas);
                        onDone();
                    }
                };
                if (typeof reader.result === 'string') {
                    img.src = reader.result;
                }
            };
            reader.readAsDataURL(file);
        },
        [onCapture, onDone]
    );

    return (
        <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
        />
    );
}
