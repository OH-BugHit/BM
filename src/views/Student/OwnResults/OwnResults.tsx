import { useAtom } from 'jotai';
import style from './results.module.css';
import { activeViewAtom } from '../../../atoms/state';
import { Button } from '@genai-fi/base';
import { close } from '../../../components/Buttons/buttonStyles';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { ResultsGallery } from './ResultsGallery';
import { RefObject } from 'react';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
}

export default function OwnResults({ currentData }: Props) {
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
                        <Button
                            onClick={() =>
                                setActiveView((old) => ({
                                    ...old,
                                    overlay: 'none',
                                }))
                            }
                            variant="contained"
                            style={close}
                        >
                            <CloseSharpIcon />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
