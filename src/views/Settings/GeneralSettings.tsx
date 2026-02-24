import { useAtom, useSetAtom } from 'jotai';
import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import LangSelect from '../../components/LangSelect/LangSelect';
import { configAtom, settingAtom, showTipsAtom } from '../../atoms/state';

export default function GeneralSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useAtom(settingAtom);
    const setConfig = useSetAtom(configAtom);
    const [tips, setTips] = useAtom(showTipsAtom);

    return (
        <div className={style.column}>
            <LangSelect />
            <div className={style.spacer} />
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
                        checked={settings.pauseOnChange || false}
                        onChange={(_, checked) => setSettings((old) => ({ ...old, pauseOnChange: checked }))}
                    />
                }
                label={t('settings.labels.pauseOnChange')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.datasetGallery.allowAllLabels}
                        onChange={(_, checked) => {
                            setSettings((old) => ({
                                ...old,
                                datasetGallery: { allowAllLabels: checked },
                            }));
                            setConfig((old) => ({ ...old, settings: { ...old.settings, allowAllLabels: checked } }));
                        }}
                    />
                }
                label={t('settings.labels.allowAllLabelsView')}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={settings.limitScoreboard.showAll}
                        onChange={(_, checked) =>
                            setSettings((old) => ({
                                ...old,
                                limitScoreboard: { limit: old.limitScoreboard.limit, showAll: checked },
                            }))
                        }
                    />
                }
                label={t('settings.labels.showFullScoreboard')}
            />
            <div className={style.spacer} />
            <TextField
                type="number"
                disabled={settings.limitScoreboard.showAll}
                value={settings.limitScoreboard.limit}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSettings((old) => ({
                        ...old,
                        limitScoreboard: { limit: parseInt(event.target.value), showAll: old.limitScoreboard.showAll },
                    }));
                }}
                sx={{ maxWidth: 'fit-content' }}
                label={
                    <Trans
                        values={{ limit: settings.limitScoreboard.limit }}
                        i18nKey="settings.labels.scoreboardLimit"
                    />
                }
                slotProps={{
                    input: {
                        inputProps: {
                            min: 0,
                            step: 1,
                        },
                    },
                }}
            />
        </div>
    );
}
