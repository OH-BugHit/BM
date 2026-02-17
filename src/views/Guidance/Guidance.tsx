import { MenuItem, MenuList } from '@mui/material';
import style from './style.module.css';
import { TeacherDialogs, TeacherViews } from '../../utils/types';
import { useAtom, useSetAtom } from 'jotai';
import { configAtom, guidanceActiveAtom, guidanceStepAtom } from '../../atoms/state';
import ActionButton from './ActionButton';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MiscButtons from './MiscButtons';
import { useLocation, useNavigate } from 'react-router';

export default function Guidance() {
    const { t } = useTranslation('translation', { keyPrefix: 'guide' });
    const setConfig = useSetAtom(configAtom);
    const setGuidanceActive = useSetAtom(guidanceActiveAtom);
    const [currentSelected, setCurrentSelected] = useAtom(guidanceStepAtom);
    const stepRefs = useRef<Record<number, HTMLLIElement | null>>({});
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

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
                    params.set('overlay', 'share');
                    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
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
                    params.set('view', 'termChange');
                    params.set('overlay', 'none');
                    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
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
                        heatmap: { on: prev.heatmap.on, force: !prev.heatmap.force },
                    }));
                    break;
                }
                case 'dataset': {
                    setConfig((prev) => ({
                        ...prev,
                        gallery: { on: prev.gallery.on, force: !prev.gallery.force },
                    }));
                }
            }
        },
        [navigate, setConfig, setCurrentSelected, location, params]
    );

    const data: { index: number; title: string; view: TeacherDialogs | TeacherViews; action: string }[] = [
        { index: 1, title: t('normal.steps.teacher.1.title'), view: 'share', action: 'share' },
        { index: 2, title: t('normal.steps.teacher.2.title'), view: 'termChange', action: 'share' },
        { index: 3, title: t('normal.steps.teacher.3.title'), view: 'userGrid', action: 'pause' },
        { index: 4, title: t('normal.steps.teacher.4.title'), view: 'userGrid', action: 'heatmap' },
        { index: 5, title: t('normal.steps.teacher.5.title'), view: 'datasetGallery', action: 'dataset' },
        { index: 6, title: t('normal.steps.teacher.6.title'), view: 'results', action: 'pause' },
        { index: 7, title: t('normal.steps.teacher.7.title'), view: 'results', action: 'reset' },
    ];

    // Sync URL view parameter to currentSelected step
    useEffect(() => {
        const viewParam = params.get('view');
        if (viewParam) {
            const matchingStep = {
                connect: 1,
                select: 2,
                explore: 3,
                heatmap: 4,
                data: 5,
                results: 6,
                ready: 7,
            }[viewParam as string];

            if (matchingStep && matchingStep !== currentSelected) {
                setCurrentSelected(matchingStep);
            }
        }
    }, [location.search, currentSelected, setCurrentSelected, params]);

    const handleStepChage = (selectedStep: { index: number; title: string; view: TeacherDialogs | TeacherViews }) => {
        switch (selectedStep.index) {
            case 1: {
                params.set('view', 'connect');
                params.set('overlay', 'share');
                break;
            }

            case 2: {
                params.set('view', 'select');
                params.set('overlay', 'none');
                break;
            }

            case 3: {
                params.set('view', 'explore');
                params.set('overlay', 'none');
                break;
            }

            case 4: {
                setConfig((prev) => ({
                    ...prev,
                    heatmap: { on: true, force: prev.heatmap.force },
                }));
                params.set('view', 'heatmap');
                params.set('overlay', 'none');
                break;
            }

            case 5: {
                setConfig((prev) => ({
                    ...prev,
                    gallery: { on: true, force: prev.gallery.force },
                }));
                params.set('view', 'data');
                params.set('overlay', 'none');
                break;
            }

            case 6: {
                params.set('view', 'results');
                params.set('overlay', 'none');
                break;
            }

            case 7: {
                setConfig((prev) => ({
                    ...prev,
                    pause: true,
                }));
                params.set('view', 'ready');
                params.set('overlay', 'none');
                break;
            }

            default:
                return;
        }
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });
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
                <p className={style.guidanceTitle}>{t('common.exit')}</p>
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
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                },
                            }}
                            onClick={() => {
                                setCurrentSelected(step.index);
                                handleStepChage(step);
                            }}
                            key={step.index}
                            component="li"
                            ref={(el) => {
                                stepRefs.current[step.index] = el;
                            }}
                        >
                            <p className={style.guidanceTitle}>
                                {step.index}. {step.title}
                            </p>
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
