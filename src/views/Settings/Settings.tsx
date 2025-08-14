import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { showSettingsDialogAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { Button } from '@genai-fi/base';
import GeneralSettings from './GeneralSettings';
import PictureSettings from './PictureSettings';

export default function Settings() {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useAtom(showSettingsDialogAtom);
    const [tabNumber, setTabNumber] = useState(0);

    const doClose = useCallback(() => setShowDialog(false), [setShowDialog]);

    return (
        <Dialog
            open={showDialog}
            onClose={doClose}
            maxWidth="md"
            scroll="paper"
            fullWidth
        >
            <DialogTitle className={style.title}>{t('settings.titles.settings')}</DialogTitle>
            <DialogContent sx={{ display: 'flex', padding: 0, maxHeight: '600px' }}>
                <Tabs
                    value={tabNumber}
                    onChange={(_, value) => setTabNumber(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    orientation="vertical"
                    sx={{ borderRight: '1px solid #008297' }}
                >
                    <Tab label={t('settings.titles.general')} />
                    <Tab label={t('settings.titles.pictureSettings')} />
                </Tabs>
                {tabNumber === 0 && <GeneralSettings />}
                {tabNumber === 1 && <PictureSettings />}
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
    );
}
