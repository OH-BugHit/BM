import { FormControlLabel, IconButton, Switch } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';
import { useAtom } from 'jotai';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReplayIcon from '@mui/icons-material/Replay';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CollectionsIcon from '@mui/icons-material/Collections';
import { configAtom } from '../../atoms/state';
import style from './style.module.css';

interface Props extends PropsWithChildren {
    action: string;
    onAction?: () => void;
    selected?: boolean;
    color?: 'secondary' | 'primary' | 'inherit' | 'default' | 'error' | 'info' | 'success' | 'warning' | undefined;
}

export default function ActionButton({ action, onAction, children, selected = false, color = 'secondary' }: Props) {
    const [config, setConfig] = useAtom(configAtom);

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
            {action === 'heatmap' && <LocalFireDepartmentIcon color={config.heatmap.on ? 'secondary' : 'primary'} />}
            {action === 'heatmap' && (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                color="secondary"
                                checked={!!config.heatmap.force}
                                onChange={(e) =>
                                    setConfig((prev) => ({
                                        ...prev,
                                        heatmap: { on: prev.heatmap.on, force: e.target.checked },
                                    }))
                                }
                            />
                        }
                        label="Pakota"
                        labelPlacement="bottom"
                        className={style.forceText}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                </>
            )}
            {action === 'dataset' && (
                <CollectionsIcon
                    fontSize="large"
                    color={config.gallery.on ? 'secondary' : 'primary'}
                />
            )}
            {action === 'dataset' && (
                <FormControlLabel
                    control={
                        <Switch
                            color="secondary"
                            checked={!!config.gallery.force}
                            onChange={(e) =>
                                setConfig((prev) => ({
                                    ...prev,
                                    gallery: { on: prev.gallery.on, force: e.target.checked },
                                }))
                            }
                        />
                    }
                    label="Pakota"
                    labelPlacement="bottom"
                    className={style.forceText}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            )}
            {action === 'share' && <QrCode2Icon />}
            {action === 'reset' && <ReplayIcon />}
            {action === 'changeModel' && <ModelTrainingIcon fontSize={'large'} />}
        </IconButton>
    );
}
