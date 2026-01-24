import { IconButton } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';
import { useAtom } from 'jotai';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReplayIcon from '@mui/icons-material/Replay';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { configAtom } from '../../atoms/state';

interface Props extends PropsWithChildren {
    action: string;
    onAction?: () => void;
    selected?: boolean;
    color?: 'secondary' | 'primary' | 'inherit' | 'default' | 'error' | 'info' | 'success' | 'warning' | undefined;
}

export default function ActionButton({ action, onAction, children, selected = false, color = 'secondary' }: Props) {
    const [config] = useAtom(configAtom);

    const doClick = useCallback(() => {
        if (onAction) onAction();
    }, [onAction]);

    return (
        <IconButton
            onClick={doClick}
            color={color}
            data-testid="action-button"
            aria-selected={selected}
        >
            {children}
            {action === 'pause' && config.pause && <PlayArrowIcon data-testid="paused-app" />}
            {action === 'pause' && !config.pause && <PauseIcon />}
            {action === 'share' && <QrCode2Icon />}
            {action === 'reset' && <ReplayIcon />}
            {action === 'changeModel' && <ModelTrainingIcon fontSize={'large'} />}
        </IconButton>
    );
}
