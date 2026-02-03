import style from './style.module.css';
import LangSelect from '../../../components/LangSelect/LangSelect';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { showTipsAtom, studentSettingsAtom } from '../../../atoms/state';

export default function StudentGeneralSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useAtom(studentSettingsAtom);
    const [tips, setTips] = useAtom(showTipsAtom);
    return (
        <div className={style.column}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={tips || false}
                        onChange={(_, checked) => setTips(() => checked)}
                    />
                }
                label={t('settings.labels.showTips')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.hidePictures || false}
                        onChange={(_, checked) => setSettings((old) => ({ ...old, hidePictures: checked }))}
                    />
                }
                label={t('settings.labels.hideOnDefault')}
            />

            <div className={style.spacer} />
            <LangSelect />
        </div>
    );
}
