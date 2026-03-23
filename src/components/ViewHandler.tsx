import { useSetAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router';
import { activeViewAtom } from '../atoms/state';
import { TeacherDialogs, TeacherViews } from '../utils/types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ViewHandler() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const setView = useSetAtom(activeViewAtom);
    const navigate = useNavigate();

    const view = searchParams.get('view') as TeacherViews;
    const overlay = (searchParams.get('overlay') ?? 'none') as TeacherDialogs;

    useEffect(() => {
        switch (view) {
            case 'connect': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.1.title')}`;
                break;
            }
            case 'select': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.2.title')}`;
                break;
            }
            case 'explore': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.3.title')}`;
                break;
            }
            case 'heatmap': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.4.title')}`;
                break;
            }
            case 'data': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.5.title')}`;
                break;
            }
            case 'results': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.6.title')}`;
                break;
            }
            case 'ready': {
                document.title = `${t('common.title')} - ${t('guide.normal.steps.teacher.7.title')}`;
                break;
            }
            default: {
                document.title = `${t('common.title')}`;
            }
        }
    }, [view, t]);

    if (!view || !overlay) {
        console.warn('Missing URL parameters: view or overlay, redirecting to library');
        navigate('/library/', { replace: true });
        return null;
    }

    if (view === 'ready') {
        setView({ active: 'results', overlay: overlay });
        return null;
    } else if (view === 'heatmap' || view === 'connect' || view === 'explore') {
        setView({ active: 'userGridSimple', overlay: overlay });
    } else if (view === 'data') {
        setView({ active: 'datasetGallery', overlay: overlay });
    } else if (view === 'select') {
        setView({ active: 'termChange', overlay: overlay });
    } else setView({ active: view, overlay: overlay });

    return null;
}

export default React.memo(ViewHandler);
