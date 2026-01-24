import { useAtom } from 'jotai';
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
    const [activeView, setActiveView] = useAtom(activeViewAtom);

    return (
        <>
            {activeView.overlay === 'ownResults' && (
                <div
                    className={style.resultsWrapper}
                    onClick={() =>
                        setActiveView((old) => ({
                            ...old,
                            overlay: old.overlay === 'ownResults' ? 'none' : 'ownResults',
                        }))
                    }
                >
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
