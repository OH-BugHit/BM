import { IconButton, MenuItem, MenuList } from '@mui/material';
import style from './style.module.css';
import { TeacherDialogs, TeacherViews } from '../../utils/types';
import { useAtom, useSetAtom } from 'jotai';
import { activeViewAtom, configAtom, guidanceActiveAtom, guidanceStepAtom, showTipsAtom } from '../../atoms/state';
import ActionButton from './ActionButton';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

export default function Guidance() {
    const { t } = useTranslation();
    const setCurrentView = useSetAtom(activeViewAtom);
    const setConfig = useSetAtom(configAtom);
    const setGuidanceActive = useSetAtom(guidanceActiveAtom);
    const [tips, setShowTips] = useAtom(showTipsAtom);
    const [currentSelected, setCurrentSelected] = useAtom(guidanceStepAtom);

    const doAction = useCallback(
        (action: string) => {
            switch (action) {
                case 'share': {
                    setCurrentView((prev) => ({ active: prev.active, overlay: 'share' }));
                    break;
                }
                case 'pause': {
                    setConfig((prev) => ({
                        ...prev,
                        pause: !prev.pause,
                    }));
                    break;
                }
                case 'reset': {
                    setCurrentView({ active: 'termChange', overlay: 'none' });
                    setConfig((prev) => ({
                        ...prev,
                        pause: true,
                        heatmap: false,
                        gallery: false,
                    }));
                    setCurrentSelected(2);
                    break;
                }
            }
        },
        [setCurrentView, setConfig, setCurrentSelected]
    );

    const data: { index: number; title: string; view: TeacherDialogs | TeacherViews; action: string }[] = [
        { index: 1, title: t('guide.normal.steps.1.title'), view: 'share', action: 'share' },
        { index: 2, title: t('guide.normal.steps.2.title'), view: 'termChange', action: 'share' },
        { index: 3, title: t('guide.normal.steps.3.title'), view: 'userGrid', action: 'pause' },
        { index: 4, title: t('guide.normal.steps.4.title'), view: 'userGrid', action: 'pause' },
        { index: 5, title: t('guide.normal.steps.5.title'), view: 'datasetGallery', action: 'pause' },
        { index: 6, title: t('guide.normal.steps.6.title'), view: 'default', action: 'pause' },
        { index: 7, title: t('guide.normal.steps.7.title'), view: 'default', action: 'reset' },
    ];

    const handleStepChage = (selectedStep: { index: number; title: string; view: TeacherDialogs | TeacherViews }) => {
        switch (selectedStep.view) {
            case 'share': {
                setCurrentView((prev) => ({ active: prev.active, overlay: 'share' }));
                break;
            }
            case 'termChange': {
                setCurrentView({ active: 'termChange', overlay: 'none' });
                break;
            }
            case 'userGrid': {
                setCurrentView({ active: 'userGridSimple', overlay: 'none' });
                break;
            }
            case 'datasetGallery': {
                setCurrentView({ active: 'datasetGallery', overlay: 'none' });
                break;
            }
            case 'default': {
                setCurrentView({ active: 'default', overlay: 'none' });
            }
        }
        switch (selectedStep.index) {
            case 4: {
                setConfig((prev) => ({
                    ...prev,
                    heatmap: true,
                }));
                break;
            }
            case 5: {
                setConfig((prev) => ({
                    ...prev,
                    gallery: true,
                }));
                break;
            }
            case 7: {
                setConfig((prev) => ({
                    ...prev,
                    pause: true,
                }));
                break;
            }
        }
    };

    return (
        <nav
            className={style.container}
            data-testid="guidance"
        >
            {!tips && (
                <IconButton
                    style={{ position: 'absolute', top: '0', left: '0' }}
                    onClick={() => {
                        setShowTips((old) => !old);
                    }}
                    size="large"
                >
                    <InfoTwoToneIcon fontSize="large" />
                </IconButton>
            )}
            <MenuItem
                selected={false}
                onClick={() => {
                    setGuidanceActive(false);
                }}
            >
                {t('guide.common.exit')}
            </MenuItem>
            <MenuList>
                {data.map((step) => (
                    <MenuItem
                        selected={currentSelected === step.index}
                        onClick={() => {
                            handleStepChage(step);
                            setCurrentSelected(step.index);
                        }}
                        key={step.index}
                    >
                        {step.index}. {step.title}
                    </MenuItem>
                ))}
            </MenuList>

            {currentSelected && (
                <div className={style.actionContainer}>
                    {data[currentSelected - 1].action !== 'none' && (
                        <ActionButton
                            action={data[currentSelected - 1].action}
                            onAction={() => {
                                if (data[currentSelected - 1].action) {
                                    doAction(data[currentSelected - 1].action);
                                }
                            }}
                        />
                    )}
                </div>
            )}
        </nav>
    );
}
