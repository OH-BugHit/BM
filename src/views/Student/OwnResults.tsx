import { useAtom } from 'jotai';
import style from './results.module.css';
import { showOwnResultsAtom } from '../../atoms/state';
import { Button } from '@genai-fi/base';
import { close } from '../../components/Buttons/buttonStyles';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { ResultsGallery } from './ResultsGallery';
export default function OwnResults() {
    const [show, setShow] = useAtom(showOwnResultsAtom);
    return (
        <>
            {' '}
            {show && (
                <div
                    className={style.resultsWrapper}
                    onClick={() => setShow(false)}
                >
                    <Button
                        onClick={() => setShow((s) => !s)}
                        variant="contained"
                        style={close}
                    >
                        <CloseSharpIcon />
                    </Button>
                    <div
                        className={style.resultsContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ResultsGallery />
                    </div>
                </div>
            )}
        </>
    );
}
