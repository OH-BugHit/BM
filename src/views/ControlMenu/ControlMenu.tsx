import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import FloatingMenuItem from '../../components/FloatingMenu/FloatingMenuItem';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { configAtom } from '../../atoms/state';
import { MenuButton } from '../../components/Buttons/MenuButton';

export default function ControlMenu() {
    const { t } = useTranslation();
    const [config, setConfig] = useAtom(configAtom);

    return (
        <FloatingMenu
            title={t('controlMenu.titles.controlMenu')}
            placement="relative-bottom"
            label={<div className={style.menuLogo}>{t('controlMenu.titles.controlMenu')}</div>}
        >
            <FloatingMenuItem
                tooltip={config?.pause ? t('controlMenu.actions.enableApp') : t('controlMenu.actions.disableApp')}
                selected={config?.pause}
            >
                <MenuButton
                    color="inherit"
                    onClick={() => setConfig((old) => ({ ...old, pause: !old.pause }))}
                    aria-label={t('controlMenu.actions.disableApp')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    {config?.pause ? <PlayCircleIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
                </MenuButton>
            </FloatingMenuItem>
            <FloatingMenuItem
                tooltip={
                    config?.heatmap.on
                        ? t('controlMenu.actions.disableHeatmap')
                        : t('controlMenu.actions.enableHeatmap')
                }
                selected={config?.heatmap.on}
            >
                <MenuButton
                    color="inherit"
                    onClick={() =>
                        setConfig((old) => ({ ...old, heatmap: { on: !old.heatmap.on, force: old.heatmap.force } }))
                    }
                    aria-label={t('controlMenu.actions.disableHeatmap')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    <LocalFireDepartmentIcon fontSize="large" />
                </MenuButton>
            </FloatingMenuItem>
            <FloatingMenuItem
                tooltip={
                    config?.gallery.on
                        ? t('controlMenu.actions.disableDataGallery')
                        : t('controlMenu.actions.enableDataGallery')
                }
                selected={config?.gallery.on}
            >
                <MenuButton
                    color="inherit"
                    onClick={() =>
                        setConfig((old) => ({ ...old, gallery: { on: !old.gallery.on, force: old.gallery.force } }))
                    }
                    aria-label={t('controlMenu.actions.disableDataGallery')}
                    size="large"
                    variant="text"
                    fullWidth
                >
                    <CollectionsIcon fontSize="large" />
                </MenuButton>
            </FloatingMenuItem>
        </FloatingMenu>
    );
}
