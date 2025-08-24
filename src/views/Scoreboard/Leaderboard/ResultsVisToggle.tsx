import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { settingAtom } from '../../../atoms/state';

/**
 * @returns Icon to toggle visibility of result pictures
 */
export default function VisibilityToggle() {
    const { t } = useTranslation();
    const [settings, setSettings] = useAtom(settingAtom);

    return (
        <>
            {settings.teacherHideResultPicture && (
                <IconButton
                    title={t('scoreboard.labels.hideResultPictures')}
                    onClick={() => {
                        setSettings((old) => ({
                            ...old,
                            teacherHideResultPicture: false,
                        }));
                    }}
                >
                    <VisibilityOffIcon
                        fontSize="large"
                        color="action"
                    />
                </IconButton>
            )}
            {!settings.teacherHideResultPicture && (
                <IconButton
                    title={t('scoreboard.labels.showResultPictures')}
                    onClick={() => {
                        setSettings((old) => ({
                            ...old,
                            teacherHideResultPicture: true,
                        }));
                    }}
                >
                    <VisibilityIcon
                        fontSize="large"
                        color="action"
                    />
                </IconButton>
            )}
        </>
    );
}
