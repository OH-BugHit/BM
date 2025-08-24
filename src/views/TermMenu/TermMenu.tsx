import FloatingMenu from '../../components/TopMenu/FloatingMenu';
import FloatingMenuItem from '../../components/TopMenu/FloatingMenuItem';
import { IconButton } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { configAtom } from '../../atoms/state';

export default function TermMenu() {
    const { t } = useTranslation();
    const [config, setConfig] = useAtom(configAtom);

    const toggleGameMode = (mode: number) => {
        if ((config.gameMode === 'single' && mode === 1) || (config.gameMode === 'all' && mode === 2)) {
            switch (mode) {
                case 1: {
                    setConfig((old) => ({
                        ...old,
                        gameMode: 'all',
                    }));
                    break;
                }
                case 2: {
                    setConfig((old) => ({
                        ...old,
                        gameMode: 'single',
                    }));
                    break;
                }
            }
        }
    };

    return (
        <>
            <FloatingMenu
                title={t('dashboard.aria.socialUserMenu')}
                placement="relative"
                label={
                    <div className={style.menuLogo}>
                        {config.gameMode === 'all' ? t('termSelect.titles.all') : t('termSelect.titles.single')}
                    </div>
                }
            >
                <FloatingMenuItem
                    tooltip={t('termSelect.actions.all')}
                    selected={config.gameMode === 'all'}
                >
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            toggleGameMode(1);
                        }}
                        aria-label={t('termSelect.actions.all')}
                    >
                        <Diversity3Icon />
                    </IconButton>
                </FloatingMenuItem>
                <FloatingMenuItem
                    tooltip={t('termSelect.actions.single')}
                    selected={config.gameMode === 'single'}
                >
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            toggleGameMode(2);
                        }}
                        aria-label={t('termSelect.actions.single')}
                    >
                        <EmojiPeopleIcon />
                    </IconButton>
                </FloatingMenuItem>
            </FloatingMenu>
        </>
    );
}
