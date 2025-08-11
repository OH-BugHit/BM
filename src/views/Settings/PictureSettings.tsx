import { useAtom } from 'jotai';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';
import { configAtom, settingAtom } from '../../atoms/state';

export default function PictureSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useAtom(settingAtom);
    const [, setConfig] = useAtom(configAtom);

    return (
        <div className={style.column}>
            <div className={style.spacer} />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.teacherHideResultPicture || false}
                        onChange={(_, checked) => setSettings((old) => ({ ...old, teacherHideResultPicture: checked }))}
                    />
                }
                label={t('settings.labels.hideResultPictures')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.allowHidePicture || false}
                        onChange={(_, checked) => {
                            setSettings((old) => ({ ...old, allowHidePicture: checked }));
                            setConfig((old) => ({ ...old, settings: { ...old.settings, allowHidePicture: checked } }));
                        }}
                    />
                }
                label={t('settings.labels.allowHidePicture')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.allowStartTermAgain || false}
                        onChange={(_, checked) => {
                            setSettings((old) => ({ ...old, allowStartTermAgain: checked }));
                            setConfig((old) => ({ ...old, settings: { ...old.settings, allowResetTerm: checked } }));
                        }}
                    />
                }
                label={t('settings.labels.allowStartTermAgain')}
            />
        </div>
    );
}
