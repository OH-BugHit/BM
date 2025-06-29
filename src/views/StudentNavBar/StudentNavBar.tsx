import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { menuShowTrainingDataAtom } from '../../atoms/state';
import style from './style.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import IconMenuItem from '../../components/IconMenu/Items';
import { MenuButton } from '../../components/Buttons/MenuButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseIcon from '@mui/icons-material/Pause';
interface Props {
    title?: string | null;
    pause: boolean;
    remotePause: boolean;
    setPause: Dispatch<SetStateAction<boolean>>;
}

export default function StudentNavBar({ pause, setPause, remotePause }: Props) {
    const { t } = useTranslation();
    const [showTraining, setShowTraining] = useAtom(menuShowTrainingDataAtom);
    const [open, setOpen] = useState(false);
    const doShowBottomMenu = useCallback(() => setOpen((s) => !s), [setOpen]);
    const doShowTraining = useCallback(() => setShowTraining((s) => !s), [setShowTraining]);

    return (
        <nav className={open ? style.bottomNav : style.bottomNavClosed}>
            <div className={open ? style.logoRowOpen : style.logoRow}>
                <div className={style.backgroundLogo}>
                    <img
                        src="/logo48_bw_invert.png"
                        width={48}
                        height={48}
                        alt="Spoofgame logo"
                    />
                </div>
                {open && (
                    <h1 style={{ maxWidth: '100%', whiteSpace: 'pre-wrap', color: 'white' }}>{t('common.title')}</h1>
                )}
                <div style={{ flexGrow: 1 }} />
            </div>
            {!open && <div style={{ flexGrow: 1 }} />}
            <IconMenuItem
                tooltip={t('student.labels.disableApp')}
                hideTip={open}
                selected={pause}
            >
                <MenuButton
                    color="inherit"
                    onClick={() => setPause((old) => !old)}
                    aria-label={t('student.labels.disableApp')}
                    size="large"
                    variant="text"
                    disabled={remotePause}
                >
                    {pause ? <PlayCircleIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
                    {open ? t('student.labels.disableApp') : ''}
                </MenuButton>
            </IconMenuItem>

            <IconMenuItem
                tooltip={t('common.labels.datasetTip')}
                hideTip={open}
                selected={showTraining}
            >
                <MenuButton
                    color="inherit"
                    onClick={doShowTraining}
                    aria-label={t('common.labels.datasetTip')}
                    size="large"
                    variant="text"
                >
                    <PsychologyIcon fontSize="large" />
                    {open ? t('common.labels.datasetTip') : ''}
                </MenuButton>
            </IconMenuItem>
            {!open && <div style={{ flexGrow: 1 }} />}
            {!open && (
                <div>
                    <MenuIcon
                        fontSize="large"
                        sx={{ width: '3.5rem', height: '3.5rem' }}
                        style={{ cursor: 'pointer', opacity: '0.7' }}
                        onClick={doShowBottomMenu}
                    />
                </div>
            )}
            {open && (
                <div style={{ flex: 0, position: 'absolute', right: 0 }}>
                    <ExpandMoreIcon
                        fontSize="large"
                        sx={{ width: '3.5rem', height: '3.5rem' }}
                        style={{ cursor: 'pointer', opacity: '0.7' }}
                        onClick={doShowBottomMenu}
                    />
                </div>
            )}
        </nav>
    );
}
