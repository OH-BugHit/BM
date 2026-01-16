import { useCallback, useState } from 'react';
import { activeViewAtom, configAtom, studentControlsAtom } from '../../atoms/state';
import style from './style.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import CollectionsIcon from '@mui/icons-material/Collections';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import IconMenuItem from '../../components/IconMenu/Items';
import { MenuButton } from '../../components/Buttons/MenuButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseIcon from '@mui/icons-material/Pause';
import HeaderRow from './HeaderRow';
import StudentInfo from './StudentInfo';

export default function StudentNavBar() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const doShowBottomMenu = useCallback(() => setOpen((s) => !s), [setOpen]);
    const [config] = useAtom(configAtom);
    const [controls, setControls] = useAtom(studentControlsAtom);
    const [activeView, setActiveView] = useAtom(activeViewAtom);

    return (
        <nav className={open ? style.bottomNav : style.bottomNavClosed}>
            <HeaderRow
                open={open}
                doShowBottomMenu={doShowBottomMenu}
            />
            <IconMenuItem
                tooltip={controls.pause ? t('student.labels.enableApp') : t('student.labels.disableApp')}
                hideTip={open}
                selected={controls.pause}
            >
                <MenuButton
                    color="inherit"
                    onClick={() => setControls((old) => ({ ...old, pause: !old.pause }))}
                    aria-label={t('student.labels.disableApp')}
                    size="large"
                    variant="text"
                    disabled={config.pause}
                >
                    {controls.pause ? <PlayCircleIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
                    {open ? (controls.pause ? t('student.labels.enableApp') : t('student.labels.disableApp')) : ''}
                </MenuButton>
            </IconMenuItem>

            <IconMenuItem
                tooltip={t('common.labels.datasetTip')}
                hideTip={open}
                selected={activeView.overlay === 'datasetGallery'}
            >
                <MenuButton
                    color="inherit"
                    onClick={() => {
                        setActiveView((old) => ({
                            ...old,
                            overlay: old.overlay === 'datasetGallery' ? 'none' : 'datasetGallery',
                        }));
                    }}
                    aria-label={t('common.labels.datasetTip')}
                    size="large"
                    variant="text"
                    disabled={!config.gallery}
                >
                    <CollectionsIcon fontSize="large" />
                    {open ? t('common.labels.datasetTip') : ''}
                </MenuButton>
            </IconMenuItem>

            <IconMenuItem
                tooltip={t('student.labels.heatmap')}
                hideTip={open}
                selected={controls.heatmap}
            >
                <MenuButton
                    color="inherit"
                    onClick={() => setControls((old) => ({ ...old, heatmap: !old.heatmap }))}
                    aria-label={t('student.labels.heatmap')}
                    size="large"
                    variant="text"
                    disabled={!config.heatmap}
                >
                    <LocalFireDepartmentIcon fontSize="large" />
                    {open ? t('student.labels.heatmap') : ''}
                </MenuButton>
            </IconMenuItem>
            <StudentInfo open={open} />
            {!open && (
                <MenuIcon
                    fontSize="large"
                    sx={{ width: '3.5rem', height: '3.5rem' }}
                    style={{ cursor: 'pointer', opacity: '0.7' }}
                    onClick={doShowBottomMenu}
                />
            )}
        </nav>
    );
}
