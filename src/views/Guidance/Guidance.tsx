import { MenuItem, MenuList } from '@mui/material';
import style from './style.module.css';
import { TeacherDialogs, TeacherViews } from '../../utils/types';
import { useAtom, useSetAtom } from 'jotai';
import { activeViewAtom, configAtom, guidanceActiveAtom, guidanceStepAtom } from '../../atoms/state';
import ActionButton from './ActionButton';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MiscButtons from './MiscButtons';

export default function Guidance() {
    const { t } = useTranslation('translation', { keyPrefix: 'guide' });
    const setCurrentView = useSetAtom(activeViewAtom);
    const setConfig = useSetAtom(configAtom);
    const setGuidanceActive = useSetAtom(guidanceActiveAtom);
    const [currentSelected, setCurrentSelected] = useAtom(guidanceStepAtom);

    const stepRefs = useRef<Record<number, HTMLLIElement | null>>({});
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Autoscroll to phase
    useEffect(() => {
        const el = stepRefs.current[currentSelected];
        if (!el) return;

        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }, [currentSelected]);

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
                        heatmap: { on: false, force: false },
                        gallery: { on: false, force: false },
                    }));
                    setCurrentSelected(2);
                    break;
                }
                case 'heatmap': {
                    setConfig((prev) => ({
                        ...prev,
                        heatmap: { on: !prev.heatmap.on, force: prev.heatmap.force },
                    }));
                    break;
                }
                case 'dataset': {
                    setConfig((prev) => ({
                        ...prev,
                        gallery: { on: !prev.gallery.on, force: prev.gallery.force },
                    }));
                }
            }
        },
        [setCurrentView, setConfig, setCurrentSelected]
    );

    const data: { index: number; title: string; view: TeacherDialogs | TeacherViews; action: string }[] = [
        { index: 1, title: t('normal.steps.teacher.1.title'), view: 'share', action: 'share' },
        { index: 2, title: t('normal.steps.teacher.2.title'), view: 'termChange', action: 'share' },
        { index: 3, title: t('normal.steps.teacher.3.title'), view: 'userGrid', action: 'pause' },
        { index: 4, title: t('normal.steps.teacher.4.title'), view: 'userGrid', action: 'heatmap' },
        { index: 5, title: t('normal.steps.teacher.5.title'), view: 'datasetGallery', action: 'dataset' },
        { index: 6, title: t('normal.steps.teacher.6.title'), view: 'default', action: 'pause' },
        { index: 7, title: t('normal.steps.teacher.7.title'), view: 'default', action: 'reset' },
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
                    heatmap: { on: true, force: prev.heatmap.force },
                }));
                break;
            }
            case 5: {
                setConfig((prev) => ({
                    ...prev,
                    gallery: { on: true, force: prev.gallery.force },
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
            <div style={{ marginTop: '0.5rem' }}></div>
            <MenuItem
                selected={false}
                onClick={() => {
                    setGuidanceActive(false);
                }}
            >
                {t('common.exit')}
            </MenuItem>
            <div style={{ flexGrow: 1 }}></div>
            <div
                className={style.stepsContainer}
                ref={containerRef}
            >
                <MenuList>
                    {data.map((step) => (
                        <MenuItem
                            selected={step.index === currentSelected}
                            onClick={() => {
                                handleStepChage(step);
                                setCurrentSelected(step.index);
                            }}
                            key={step.index}
                            component="li"
                            ref={(el) => {
                                stepRefs.current[step.index] = el;
                            }}
                        >
                            {step.index}. {step.title}
                        </MenuItem>
                    ))}
                </MenuList>
            </div>
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
            <div style={{ flexGrow: 1 }}></div>
            <MiscButtons />
        </nav>
    );
}
