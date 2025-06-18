import { Button } from '@knicos/genai-base';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { Dispatch, SetStateAction } from 'react';

type PauseButtonProps = {
    pause: boolean;
    setPause: Dispatch<SetStateAction<boolean>>;
    data?: string;
    setConfig?: (config: { data: string; pause: boolean }) => void;
    disable?: boolean;
};

export function PauseButton({ pause, setPause, setConfig, disable = false, data }: PauseButtonProps) {
    const handlePause = () => {
        if (setConfig && data) {
            setConfig({ data: data, pause: !pause });
        }
        setPause((prev) => !prev);
    };
    return (
        <Button
            sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
            variant="contained"
            onClick={handlePause}
            disabled={disable}
        >
            {!pause ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
    );
}
