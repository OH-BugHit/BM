import { useAtom } from 'jotai';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, Slider } from '@mui/material';
import { settingAtom } from '../../atoms/state';

/**
 *
 * @returns Settings for user grid view
 */
export default function UserGridSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useAtom(settingAtom);

    return (
        <div className={style.column}>
            <div className={style.spacer} />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.userGridShowCrowns}
                        onChange={(_, checked) => setSettings((old) => ({ ...old, userGridShowCrowns: checked }))}
                    />
                }
                label={t('settings.labels.showCrowns')}
            />
            <div className={style.spacer} />
            <FormControlLabel
                style={{ flexDirection: 'column', maxWidth: '80%' }}
                label={t('settings.labels.userGridMaxColumns')}
                control={
                    <Slider
                        value={settings.userGridMaxColumns}
                        onChange={(_, value) => setSettings((old) => ({ ...old, userGridMaxColumns: value as number }))}
                        min={2}
                        max={16}
                    />
                }
            />
        </div>
    );
}
