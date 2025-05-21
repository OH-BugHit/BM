// src/utils/loadImage.ts
export async function loadImage(filename: string): Promise<string> {
    const response = await fetch(`/images/readyImages/${filename}`);
    if (!response.ok) {
        throw new Error(`Virhe ladattaessa kuvaa: ${filename}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob); // objectURL toimii selaimessa
}
