import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { activeViewAtom } from '../../atoms/state';
import { useAtomValue } from 'jotai';
import React, { useCallback, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { Button } from '@genai-fi/base';
import GeneralSettings from './GeneralSettings';
import PictureSettings from './PictureSettings';
import UserGridSettings from './UserGridSettings';
import { useLocation, useNavigate } from 'react-router';

function Settings() {
    const { t } = useTranslation();
    const showDialog = useAtomValue(activeViewAtom);
    const [tabNumber, setTabNumber] = useState(0);
    const navigate = useNavigate();

    const location = useLocation();

    const doClose = useCallback(() => {
        const params = new URLSearchParams(location.search);
        params.set('overlay', 'none');
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }, [location, navigate]);

    return (
        <Dialog
            open={showDialog.overlay === 'settings'}
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
                    <Tab label={t('settings.titles.userGridSettings')} />
                </Tabs>
                {tabNumber === 0 && <GeneralSettings />}
                {tabNumber === 1 && <PictureSettings />}
                {tabNumber === 2 && <UserGridSettings />}
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

export default React.memo(Settings);
