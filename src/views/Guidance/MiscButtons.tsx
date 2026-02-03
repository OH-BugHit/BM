import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import IconMenuItem from '../../components/IconMenu/Items';
import { MenuButton } from '../../components/Buttons/MenuButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAtom } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import { useTranslation } from 'react-i18next';
import SaveButton from '../../components/Savebutton/SaveButton';

function MiscButtons() {
    const { t } = useTranslation();
    const [activeView, setActiveView] = useAtom(activeViewAtom);

    const toMain = () => {
        window.location.href = `/`;
        sessionStorage.clear();
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <IconMenuItem
                tooltip={t('menu.labels.settings')}
                selected={activeView.overlay === 'settings'}
                fullWidth
            >
                <MenuButton
                    style={{}}
                    color="inherit"
                    onClick={() => setActiveView((old) => ({ ...old, overlay: 'settings' }))}
                    aria-label={t('menu.aria.settings')}
                    size={'large'}
                    variant="text"
                    fullWidth
                >
                    <SettingsIcon fontSize={'large'} />
                    {t('menu.labels.settings')}
                </MenuButton>
            </IconMenuItem>
            <SaveButton showText={true} />
            <IconMenuItem
                tooltip={t('menu.labels.exit')}
                selected={false}
                fullWidth
            >
                <MenuButton
                    style={{}}
                    color="inherit"
                    onClick={toMain}
                    aria-label={t('menu.labels.exit')}
                    size={'large'}
                    variant="text"
                    fullWidth
                >
                    <LogoutIcon fontSize={'large'} />
                    {t('menu.labels.exitShort')}
                </MenuButton>
            </IconMenuItem>
            <div style={{ marginBottom: '1rem' }}></div>
        </div>
    );
}

export default React.memo(MiscButtons);
