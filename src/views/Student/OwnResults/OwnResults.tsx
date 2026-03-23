import { useAtomValue } from 'jotai';
import style from './results.module.css';
import { activeViewAtom } from '../../../atoms/state';
import { ResultsGallery } from './ResultsGallery';
import React, { RefObject } from 'react';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
}

function OwnResults({ currentData }: Props) {
    const activeView = useAtomValue(activeViewAtom);

    return (
        <>
            {activeView.overlay === 'ownResults' && (
                <div className={style.resultsWrapper}>
                    <div
                        className={style.resultsContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ResultsGallery currentData={currentData} />
                    </div>
                </div>
            )}
        </>
    );
}

export default React.memo(OwnResults);
