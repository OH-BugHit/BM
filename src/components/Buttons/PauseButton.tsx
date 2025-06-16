import { Button } from '@knicos/genai-base';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { Dispatch, SetStateAction } from 'react';

type PauseButtonProps = {
    pause: boolean;
    setPause: Dispatch<SetStateAction<boolean>>;
    setConfig?: (config: { data?: string; pause?: boolean }) => void;
};

export function PauseButton({ pause, setPause, setConfig }: PauseButtonProps) {
    const handlePause = () => {
        if (setConfig) {
            setConfig({ pause: !pause });
        }
        setPause((prev) => !prev);
    };
    return (
        <Button
            sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
            variant="contained"
            onClick={handlePause}
        >
            {!pause ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
    );
}
