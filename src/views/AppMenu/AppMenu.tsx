import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CategoryIcon from '@mui/icons-material/Category';
import AbcIcon from '@mui/icons-material/Abc';
import { useAtom } from 'jotai';
import {
    configAtom,
    menuShowCategoryViewAtom,
    menuShowModelChangeAtom,
    menuShowShareAtom,
    menuShowTermChangeAtom,
    menuShowTrainingDataAtom,
    menuShowUsersAtom,
} from '../../atoms/state';
import IconMenuItem from '../../components/IconMenu/Items';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuButton } from '../../components/Buttons/MenuButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AppsIcon from '@mui/icons-material/Apps';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { useNavigate } from 'react-router-dom';

export default function MenuPanel() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showShare, setShowShare] = useAtom(menuShowShareAtom);
    const [showTraining, setShowTraining] = useAtom(menuShowTrainingDataAtom);
    const [showModel, setShowModel] = useAtom(menuShowModelChangeAtom);
    const [showUsers, setShowUsers] = useAtom(menuShowUsersAtom);
    const [showCategory, setShowCategory] = useAtom(menuShowCategoryViewAtom);
    const [showTermView, setShowTermView] = useAtom(menuShowTermChangeAtom);
    const [config, setConfig] = useAtom(configAtom);

    const doShowShare = useCallback(() => setShowShare((s) => !s), [setShowShare]);
    const doShowModel = useCallback(() => setShowModel((s) => !s), [setShowModel]);
    const doShowSubview = useCallback(
        (subview: 'users' | 'trainingData' | 'category' | 'term') => {
            switch (subview) {
                case 'users':
                    setShowUsers((s) => !s);
                    setShowTraining(false);
                    setShowCategory(false);
                    setShowTermView(false);
                    break;
                case 'trainingData':
                    setShowTraining((s) => !s);
                    setShowUsers(false);
                    setShowCategory(false);
                    setShowTermView(false);
                    break;
                case 'category':
                    setShowCategory(true);
                    setShowUsers(false);
                    setShowTraining(false);
                    setShowTermView(false);
                    break;
                case 'term':
                    setShowCategory(false);
                    setShowUsers(false);
                    setShowTraining(false);
                    setShowTermView(true);
                    break;
                default:
                    console.warn('Unknown subview:', subview);
            }
        },
        [setShowUsers, setShowTraining, setShowCategory, setShowTermView]
    );

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
            <div className={style.sideNavSection}>
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

                <IconMenuItem
                    tooltip={t('teacher.labels.disableHeatmap')}
                    hideTip={open}
                    selected={config?.heatmap}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => setConfig((old) => ({ ...old, heatmap: !old.heatmap }))}
                        aria-label={t('teacher.labels.disableHeatmap')}
                        size="large"
                        variant="text"
                        fullWidth
                    >
                        <LocalFireDepartmentIcon fontSize="large" />
                        {open ? t('teacher.labels.disableHeatmap') : ''}
                    </MenuButton>
                </IconMenuItem>

                <IconMenuItem
                    tooltip={t('teacher.labels.disableDataGallery')}
                    hideTip={open}
                    selected={config?.gallery}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => setConfig((old) => ({ ...old, gallery: !old.gallery }))}
                        aria-label={t('teacher.labels.disableDataGallery')}
                        size="large"
                        variant="text"
                        fullWidth
                    >
                        <PsychologyIcon fontSize="large" />
                        {open ? t('teacher.labels.disableDataGallery') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            {/*showTree && <MenuTree open={open} />*/}

            {/*showTools && <ToolsMenu />*/}
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('menu.vis.term')}
                    fullWidth
                    selected={showTermView}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.term')}
                        size="large"
                        variant="text"
                        fullWidth
                        onClick={() => doShowSubview('term')}
                    >
                        <AbcIcon fontSize="large" />
                        {open ? t('menu.vis.term') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('menu.vis.category')}
                    fullWidth
                    selected={showCategory}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.category')}
                        size="large"
                        variant="text"
                        fullWidth
                        onClick={() => doShowSubview('category')}
                    >
                        <CategoryIcon fontSize="large" />
                        {open ? t('menu.vis.category') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('menu.vis.usergrid')}
                    fullWidth
                    selected={showUsers}
                >
                    <MenuButton
                        color="inherit"
                        aria-label={t('menu.vis.usergrid')}
                        size="large"
                        variant="text"
                        fullWidth
                        onClick={() => doShowSubview('users')}
                    >
                        <AppsIcon fontSize="large" />
                        {open ? t('menu.vis.usergrid') : ''}
                    </MenuButton>
                </IconMenuItem>
                <IconMenuItem
                    tooltip={t('common.labels.datasetTip')}
                    hideTip={open}
                    selected={showTraining}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={() => doShowSubview('trainingData')}
                        aria-label={t('common.labels.datasetTip')}
                        size="large"
                        variant="text"
                        fullWidth
                    >
                        <PsychologyIcon fontSize="large" />
                        {open ? t('common.labels.datasetTip') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>
            <div className={style.sideNavSection}>
                <IconMenuItem
                    tooltip={t('teacher.labels.changeModel')}
                    hideTip={open}
                    selected={showModel}
                    fullWidth
                >
                    <MenuButton
                        color="inherit"
                        onClick={doShowModel}
                        aria-label={t('teacher.labels.changeModel')}
                        size="large"
                        variant="text"
                        fullWidth
                    >
                        <ModelTrainingIcon fontSize="large" />
                        {open ? t('teacher.labels.changeModel') : ''}
                    </MenuButton>
                </IconMenuItem>
            </div>

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
