import style from './results.module.css';
import { useAtom, useSetAtom } from 'jotai';
import { activeViewAtom, isOutOfFocusAtom } from '../../../atoms/state';
import { ResultsGallery } from './ResultsGallery';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import OpenedImage from '../../../components/ImageView/OpenedImage';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
}

// TODO korjaa ref päivitys, tämä ei vielä toimi!!

function OwnResults({ currentData }: Props) {
    const [activeView, setActiveView] = useAtom(activeViewAtom);
    const setIsResultsOpen = useSetAtom(isOutOfFocusAtom);
    const [openImage, setOpenImage] = useState<HTMLCanvasElement | null>(null);
    const openedImageRef = useRef<HTMLDivElement | null>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (openImage) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            requestAnimationFrame(() => {
                openedImageRef.current?.focus();
            });
        } else {
            requestAnimationFrame(() => {
                previousFocusRef.current?.focus();
            });
        }
    }, [openImage]);

    const doClose = () => {
        setIsResultsOpen(undefined);
        setActiveView((old) => ({
            ...old,
            overlay: 'none',
        }));
    };

    return (
        <>
            <Dialog
                open={activeView.overlay === 'ownResults'}
                onClose={doClose}
                maxWidth={'sm'}
                fullWidth
                disableEnforceFocus
                disableRestoreFocus
            >
                <DialogContent
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '0 0 1rem 0' }}
                >
                    <ResultsGallery
                        currentData={currentData}
                        doClose={doClose}
                        openImage={openImage}
                        setOpenImage={setOpenImage}
                    />
                </DialogContent>
            </Dialog>
            {openImage && (
                <div
                    ref={openedImageRef}
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                    tabIndex={-1}
                >
                    <OpenedImage
                        setOpenImage={setOpenImage}
                        openImage={null}
                        openCanvas={openImage}
                    />
                </div>
            )}
        </>
    );
}

export default React.memo(OwnResults);
