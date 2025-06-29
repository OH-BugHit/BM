import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useAtom } from 'jotai';
import { configAtom, menuShowShareAtom, menuShowTrainingDataAtom } from '../../atoms/state';
import IconMenuItem from '../../components/IconMenu/Items';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuButton } from '../../components/Buttons/MenuButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ShortCuts from './ShortCuts';
import { useNavigate } from 'react-router-dom';

export default function MenuPanel() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showShare, setShowShare] = useAtom(menuShowShareAtom);
    const [showTraining, setShowTraining] = useAtom(menuShowTrainingDataAtom);
    const [config, setConfig] = useAtom(configAtom);
    // const showTools = useRecoilValue(menuShowTools);
    // const showTree = useRecoilValue(menuTreeMenu);
    // const serial = useSettingSerialise();
    // const { content: contentSvc, profiler: profilerSvc, actionLog } = useServices();

    const doShowShare = useCallback(() => setShowShare((s) => !s), [setShowShare]);
    const doShowTraining = useCallback(() => setShowTraining((s) => !s), [setShowTraining]);

    const toMain = () => {
        const confirmLeave = window.confirm('Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua?');
        if (!confirmLeave) return;
        navigate('/');
    };

    return (
        <nav className={open ? style.sideNav : style.sideNavClosed}>
            <div className={open ? style.logoRowOpen : style.logoRow}>
                {open && (
                    <div className={style.backgroundLogo}>
                        <img
                            src="/logo48_bw_invert.png"
                            width={48}
                            height={48}
                            alt="Spoofgame logo"
                        />
                        <h1>SpoofGame</h1>
                    </div>
                )}
                <IconButton
                    color="inherit"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={t('teacher.aria.mainMenu')}
                    aria-pressed={open}
                >
                    {open ? <ArrowBackIosIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                </IconButton>
            </div>

            <IconMenuItem
                tooltip={t('teacher.labels.shareTip')}
                hideTip={open}
                selected={showShare}
                fullWidth
            >
                <MenuButton
                    color="inherit"
                    onClick={doShowShare}
                    aria-label={t('teacher.labels.shareTip')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    <QrCode2Icon fontSize="large" />
                    {open ? t('teacher.labels.shareTip') : ''}
                </MenuButton>
            </IconMenuItem>
            <IconMenuItem
                tooltip={t('teacher.labels.disableApp')}
                hideTip={open}
                selected={config?.pause}
                fullWidth
            >
                <MenuButton
                    color="inherit"
                    onClick={() => setConfig((old) => ({ ...old, pause: !old.pause }))}
                    aria-label={t('teacher.labels.disableApp')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    {config?.pause ? <PlayCircleIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
                    {open ? t('teacher.labels.disableApp') : ''}
                </MenuButton>
            </IconMenuItem>

            {!open && <ShortCuts />}
            {/*showTree && <MenuTree open={open} />*/}

            {/*showTools && <ToolsMenu />*/}
            <IconMenuItem
                tooltip={t('common.labels.datasetTip')}
                hideTip={open}
                selected={showTraining}
                fullWidth
            >
                <MenuButton
                    color="inherit"
                    onClick={doShowTraining}
                    aria-label={t('common.labels.datasetTip')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    <PsychologyIcon fontSize="large" />
                    {open ? t('common.labels.datasetTip') : ''}
                </MenuButton>
            </IconMenuItem>
            <div style={{ flexGrow: 1 }} />
            <IconMenuItem
                tooltip={t('menu.labels.exit')}
                hideTip={open}
                selected={false}
                fullWidth
            >
                <MenuButton
                    color="inherit"
                    onClick={toMain}
                    aria-label={t('menu.aria.exit')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    <LogoutIcon fontSize="large" />
                    {open ? t('menu.labels.exit') : ''}
                </MenuButton>
            </IconMenuItem>
            <div style={{ paddingBottom: '40px' }} />
        </nav>
    );
}
