import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import AbcIcon from '@mui/icons-material/Abc';
import { useAtom, useSetAtom } from 'jotai';
import { selectedUserAtom, activeViewAtom, guidanceActiveAtom } from '../../atoms/state';
import IconMenuItem from '../../components/IconMenu/Items';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuButton } from '../../components/Buttons/MenuButton';
import CollectionsIcon from '@mui/icons-material/Collections';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AppsIcon from '@mui/icons-material/Apps';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { TeacherDialogs, TeacherViews } from '../../utils/types';

export default function MenuPanel() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [activeView, setActiveView] = useAtom(activeViewAtom);
    const [, setSelectedUser] = useAtom(selectedUserAtom);
    const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('large');
    const setGuidanceActive = useSetAtom(guidanceActiveAtom);

    useEffect(() => {
        const handleResize = () => setIconSize(window.innerHeight < 700 ? 'medium' : 'large');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const doShowDialog = useCallback(
        (dialog: TeacherDialogs) => {
            if (activeView.overlay === dialog) {
                setActiveView((old) => ({ ...old, overlay: 'none' }));
            } else setActiveView((old) => ({ ...old, overlay: dialog }));
        },
        [activeView, setActiveView]
    );

    const doShowView = useCallback(
        (view: TeacherViews) => {
            setSelectedUser({ username: '', profilePicture: null });
            setActiveView(() => ({ overlay: 'none', active: view }));
        },
        [setSelectedUser, setActiveView]
    );

    const doShowGuidance = useCallback(() => {
        setGuidanceActive((prev) => !prev);
    }, [setGuidanceActive]);

    const toMain = () => {
        window.location.href = `/`;
        sessionStorage.clear();
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
                        <h3>{t('common.title')}</h3>
                    </div>
                )}
                <IconButton
                    color="inherit"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={t('teacher.aria.mainMenu')}
                    aria-pressed={open}
                >
                    {open ? <ArrowBackIosIcon fontSize={iconSize} /> : <MenuIcon fontSize={iconSize} />}
                </IconButton>
            </div>
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('menu.vis.guidance')}
                    hideTip={open}
                    selected={true}
                    fullWidth
                >
                    <MenuButton
                        onClick={() => doShowGuidance()}
                        aria-label={t('menu.vis.guidance')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                        style={{ color: 'gold' }}
                    >
                        <TipsAndUpdatesIcon fontSize={iconSize} />
                        {open ? t('menu.vis.guidance') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('teacher.labels.shareTip')}
                    hideTip={open}
                    selected={activeView.overlay === 'share'}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => doShowDialog('share')}
                        aria-label={t('teacher.labels.shareTip')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                    >
                        <QrCode2Icon fontSize={iconSize} />
                        {open ? t('teacher.labels.shareTip') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('menu.vis.term')}
                    hideTip={open}
                    fullWidth
                    selected={activeView.active === 'termChange'}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.term')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                        onClick={() => doShowView('termChange')}
                    >
                        <AbcIcon fontSize={iconSize} />
                        {open ? t('menu.vis.term') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('menu.vis.usergrid')}
                    hideTip={open}
                    fullWidth
                    selected={activeView.active === 'userGrid' || activeView.active === 'userGridSimple'}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.usergrid')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                        onClick={() => doShowView('userGrid')}
                    >
                        <AppsIcon fontSize={iconSize} />
                        {open ? t('menu.vis.usergrid') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('common.labels.datasetTip')}
                    hideTip={open}
                    selected={activeView.active === 'datasetGallery'}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => doShowView('datasetGallery')}
                        aria-label={t('common.labels.datasetTip')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                    >
                        <CollectionsIcon fontSize={iconSize} />
                        {open ? t('common.labels.datasetTip') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('menu.vis.results')}
                    hideTip={open}
                    fullWidth
                    selected={activeView.active === 'default'}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.results')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                        style={{ minHeight: '64px', minWidth: '64px' }}
                        onClick={() => doShowView('default')}
                    >
                        <EmojiEventsIcon fontSize={iconSize} />
                        {open ? t('menu.vis.results') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('teacher.labels.changeModel')}
                    hideTip={open}
                    selected={activeView.overlay === 'modelChange'}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => doShowDialog('modelChange')}
                        aria-label={t('teacher.labels.changeModel')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                    >
                        <ModelTrainingIcon fontSize={iconSize} />
                        {open ? t('teacher.labels.changeModel') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>

            <div style={{ flexGrow: 1 }} />

            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('menu.labels.settings')}
                    hideTip={open}
                    selected={activeView.overlay === 'settings'}
                    fullWidth
                >
                    <MenuButton
                        style={{}}
                        color="inherit"
                        onClick={() => doShowDialog('settings')}
                        aria-label={t('menu.aria.settings')}
                        size={iconSize}
                        variant="text"
                        fullWidth
                    >
                        <SettingsIcon fontSize={iconSize} />
                        {open ? t('menu.labels.settings') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div className={style.sideNavSection}>
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
                        size={iconSize}
                        variant="text"
                        fullWidth
                    >
                        <LogoutIcon fontSize={iconSize} />
                        {open ? t('menu.labels.exit') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div style={{ paddingBottom: '32px' }} />
        </nav>
    );
}
