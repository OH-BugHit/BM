import { IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReplayIcon from '@mui/icons-material/Replay';
import { configAtom } from '../../atoms/state';

interface Props {
    action: string;
    onAction?: () => void;
}

export default function ActionButton({ action, onAction }: Props) {
    const [config] = useAtom(configAtom);

    const doClick = useCallback(() => {
        if (onAction) onAction();
    }, [onAction]);

    return (
        <IconButton
            onClick={doClick}
            color="secondary"
            data-testid="action-button"
        >
            {action === 'pause' && config.pause && <PlayArrowIcon data-testid="paused-app" />}
            {action === 'pause' && !config.pause && <PauseIcon />}
            {action === 'share' && <QrCode2Icon />}
            {action === 'reset' && <ReplayIcon />}
        </IconButton>
    );
}
