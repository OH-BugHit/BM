import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Button } from '@genai-fi/base';
import { activeViewAtom } from '../../../atoms/state';
import StudentGeneralSettings from './StudentGeneralSettings';
import SettingsIcon from '@mui/icons-material/Settings';

export default function StudentSettings() {
    const { t } = useTranslation();
    const [showDialog, setActiveView] = useAtom(activeViewAtom);

    const doClose = useCallback(() => setActiveView((old) => ({ ...old, overlay: 'none' })), [setActiveView]);

    return (
        <>
            <IconButton
                className={style.settingsButton}
                color="inherit"
                onClick={() => setActiveView((old) => ({ ...old, overlay: 'settings' }))}
                aria-label={t('teacher.aria.mainMenu')}
                aria-pressed={showDialog.overlay === 'settings'}
                sx={{ position: 'absolute' }}
            >
                <SettingsIcon
                    fontSize="large"
                    color="primary"
                />
            </IconButton>
            <Dialog
                open={showDialog.overlay === 'settings'}
                onClose={doClose}
                maxWidth="sm"
                scroll="paper"
                fullWidth
            >
                <DialogTitle className={style.title}>{t('settings.titles.settings')}</DialogTitle>
                <DialogContent sx={{ display: 'flex', padding: 0, maxHeight: '600px' }}>
                    <StudentGeneralSettings />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={doClose}
                    >
                        {t('common.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
