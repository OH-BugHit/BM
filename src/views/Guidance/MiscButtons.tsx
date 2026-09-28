import React, { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import IconMenuItem from '../../components/IconMenu/Items';
import { MenuButton } from '../../components/Buttons/MenuButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAtom, useAtomValue } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import SaveButton from '../../components/Save_Load_Buttons/SaveButton';
import style from './style.module.css';
import ReportIcon from '@mui/icons-material/Report';
import ReportDialog from '../../components/ReportDialog/ReportDialog';
import { featureFlagsAtom } from '../../atoms/featureState';

function MiscButtons() {
    const { t } = useTranslation();
    const [activeView] = useAtom(activeViewAtom);
    const [, setSearchParams] = useSearchParams();
    const [showReportDialog, setShowReportDialog] = useState(false);
    const { allowReportProblem } = useAtomValue(featureFlagsAtom);

    const toMain = () => {
        window.location.href = `/`;
        sessionStorage.clear();
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            {allowReportProblem && (
                <IconMenuItem
                    tooltip={t('app.reportProblemTip')}
                    selected={showReportDialog}
                    fullWidth
                >
                    <MenuButton
                        variant="text"
                        color="inherit"
                        size={'large'}
                        onClick={() => setShowReportDialog(true)}
                    >
                        <ReportIcon fontSize="large" />
                        <p className={style.guidanceTitle}>{t('app.reportProblem')}</p>
                    </MenuButton>
                </IconMenuItem>
            )}
            <IconMenuItem
                tooltip={t('menu.labels.settings')}
                selected={activeView.overlay === 'settings'}
                fullWidth
            >
                <MenuButton
                    style={{}}
                    color="inherit"
                    onClick={() => {
                        setSearchParams((prev) => {
                            prev.set('overlay', 'settings');
                            return prev;
                        });
                    }} // setActiveView((old) => ({ ...old, overlay: 'settings' }))}
                    aria-label={t('menu.aria.settings')}
                    size={'large'}
                    variant="text"
                    fullWidth
                >
                    <SettingsIcon fontSize={'large'} />
                    <p className={style.guidanceTitle}>{t('menu.labels.settings')}</p>
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
                    <p className={style.guidanceTitle}>{t('menu.labels.exitShort')}</p>
                </MenuButton>
            </IconMenuItem>
            <div style={{ marginBottom: '1rem' }}></div>
            {allowReportProblem && showReportDialog && (
                <ReportDialog
                    open={showReportDialog}
                    onClose={() => setShowReportDialog(false)}
                />
            )}
        </div>
    );
}

export default React.memo(MiscButtons);
