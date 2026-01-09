import { MenuItem, MenuList } from '@mui/material';
import style from './style.module.css';
import { TeacherDialogs, TeacherViews } from '../../utils/types';
import { useAtom } from 'jotai';
import { activeViewAtom, configAtom, guidanceActiveAtom } from '../../atoms/state';
import { useRef } from 'react';
import ActionButton from './ActionButton';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function Guidance() {
    const { t } = useTranslation();
    const [, setCurrentView] = useAtom(activeViewAtom);
    const [, setConfig] = useAtom(configAtom);
    const [, setGuidanceActive] = useAtom(guidanceActiveAtom);
    const currentSelected = useRef(1);

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
                    currentSelected.current = 2;
                    break;
                }
            }
        },
        [setCurrentView, setConfig]
    );

    const data: { index: number; title: string; view: TeacherDialogs | TeacherViews; action: string }[] = [
        { index: 1, title: t('guide.normal.steps.1.title'), view: 'share', action: 'share' },
        { index: 2, title: t('guide.normal.steps.2.title'), view: 'termChange', action: 'share' },
        { index: 3, title: t('guide.normal.steps.3.title'), view: 'userGrid', action: 'pause' },
        { index: 4, title: t('guide.normal.steps.4.title'), view: 'userGrid', action: 'pause' },
        { index: 5, title: t('guide.normal.steps.5.title'), view: 'trainingData', action: 'pause' },
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
            case 'trainingData': {
                setCurrentView({ active: 'userGridSimple', overlay: 'trainingData' });
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
            case 6: {
                setConfig((prev) => ({
                    ...prev,
                    pause: true,
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
                        selected={currentSelected.current === step.index}
                        onClick={() => {
                            handleStepChage(step);
                            currentSelected.current = step.index;
                        }}
                        key={step.index}
                    >
                        {step.index}. {step.title}
                    </MenuItem>
                ))}
            </MenuList>

            {currentSelected && (
                <div className={style.actionContainer}>
                    {data[currentSelected.current - 1].action !== 'none' && (
                        <ActionButton
                            action={data[currentSelected.current - 1].action}
                            onAction={() => {
                                if (data[currentSelected.current - 1].action) {
                                    doAction(data[currentSelected.current - 1].action);
                                }
                            }}
                        />
                    )}
                </div>
            )}
        </nav>
    );
}
