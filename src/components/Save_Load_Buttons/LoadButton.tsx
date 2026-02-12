import React, { useRef } from 'react';
import { useStore } from 'jotai';
import { studentDataAtom, takenUsernamesAtom } from '../../atoms/state';
import JSZip from 'jszip';
import { StudentScore, StudentScores, Username } from '../../utils/types';
import { splitAndDownscaleHeatmap } from '../../utils/save';
import ContentItem from '../../views/Library/ContentItem';
import { useTranslation } from 'react-i18next';

function LoadGame() {
    const { t } = useTranslation();
    const store = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        // Open file dialog for own model
        fileInputRef.current?.click();
    };

    /**
     * Convert image blob to canvas element
     */
    async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                resolve(canvas);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            img.src = url;
        });
    }

    async function continueGame(file: File) {
        try {
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(file);

            // Read the game-state.json metadata
            const metadataFile = loadedZip.file('game-state.json');
            if (!metadataFile) {
                alert('game-state.json not found in zip file');
                return;
            }

            const metadataJson = await metadataFile.async('string');
            const metadata: Record<
                string,
                Record<string, { filename: string; score?: number; hidden: boolean }>
            > = JSON.parse(metadataJson);

            // Reconstruct StudentData
            const students = new Map<string, StudentScores>();
            const usernames: Username[] = [];

            for (const [studentId, terms] of Object.entries(metadata)) {
                const data = new Map<string, StudentScore>();

                for (const [term, scoreMetadata] of Object.entries(terms)) {
                    // Load the image file from the zip (it's in a folder named after the term)
                    const imagePath = `${term}/${scoreMetadata.filename}`;
                    const imageFile = loadedZip.file(imagePath);

                    if (imageFile) {
                        const blob = await imageFile.async('blob');
                        const canvas = await blobToCanvas(blob);
                        const { topCanvas, topHeatmap } = splitAndDownscaleHeatmap(canvas);

                        data.set(term, {
                            score: scoreMetadata.score,
                            topCanvas: topCanvas,
                            topHeatmap: topHeatmap,
                            hidden: scoreMetadata.hidden,
                        });
                    }
                }

                if (data.size > 0) {
                    students.set(studentId, { data });
                    usernames.push({ username: studentId });
                }
            }

            // Set atoms
            store.set(studentDataAtom, { students });
            store.set(takenUsernamesAtom, usernames);

            alert(`Game loaded successfully. ${usernames.length} students restored.`);
        } catch (error) {
            console.error('Error loading game:', error);
            alert(`Failed to load game: ${error}`);
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            continueGame(file);
        }
    };

    return (
        <>
            <ContentItem
                title={t('library.continue.title')}
                image="/images/library/continue.png"
                description={t('library.continue.description')}
                onClick={() => handleClick()}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </>
    );
}

export default React.memo(LoadGame);
