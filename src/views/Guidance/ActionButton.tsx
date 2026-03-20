import { FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';
import { useAtom } from 'jotai';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReplayIcon from '@mui/icons-material/Replay';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { configAtom } from '../../atoms/state';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';

interface Props extends PropsWithChildren {
    action: string;
    onAction?: () => void;
    selected?: boolean;
    color?: 'secondary' | 'primary' | 'inherit' | 'default' | 'error' | 'info' | 'success' | 'warning' | undefined;
    tooltipTitle?: string;
}

export default function ActionButton({
    action,
    onAction,
    children,
    selected = false,
    color = 'secondary',
    tooltipTitle,
}: Props) {
    const [config, setConfig] = useAtom(configAtom);
    const { t } = useTranslation();

    const doClick = useCallback(() => {
        if (onAction) onAction();
    }, [onAction]);

    const provideTitle = () => {
        if (tooltipTitle) return tooltipTitle;
        switch (action) {
            case 'pause': {
                if (config.pause) {
                    return t('controlMenu.actions.enableApp');
                } else {
                    return t('controlMenu.actions.disableApp');
                }
            }
            case 'share': {
                return t('teacher.titles.connectUsers');
            }
            case 'reset': {
                return t('guide.common.startNew');
            }
            case 'heatmap': {
                return t('guide.common.force.heatmap');
            }
            case 'dataset': {
                return t('guide.common.force.dataset');
            }
        }
    };

    const label = provideTitle();

    return (
        <Tooltip title={label}>
            <div>
                {action !== 'heatmap' && action !== 'dataset' && (
                    <IconButton
                        onClick={doClick}
                        color={color}
                        data-testid="action-button"
                        aria-label={label}
                        aria-pressed={selected}
                    >
                        {children}
                        {action === 'pause' && config.pause && <PlayArrowIcon />}
                        {action === 'pause' && !config.pause && <PauseIcon />}
                        {action === 'share' && <QrCode2Icon />}
                        {action === 'reset' && <ReplayIcon />}
                        {action === 'changeModel' && <ModelTrainingIcon fontSize="large" />}
                    </IconButton>
                )}
                {(action === 'heatmap' || action === 'dataset') && (
                    <FormControlLabel
                        control={
                            <Switch
                                color="secondary"
                                checked={action === 'heatmap' ? !!config.heatmap.force : !!config.gallery.force}
                                onChange={(e) => {
                                    if (action === 'heatmap') {
                                        setConfig((prev) => ({
                                            ...prev,
                                            heatmap: { on: prev.heatmap.on, force: e.target.checked },
                                        }));
                                    } else {
                                        setConfig((prev) => ({
                                            ...prev,
                                            gallery: { on: prev.gallery.on, force: e.target.checked },
                                        }));
                                    }
                                }}
                            />
                        }
                        label={t('guide.common.force.force')}
                        labelPlacement="bottom"
                        className={style.forceText}
                    />
                )}
            </div>
        </Tooltip>
    );
}
