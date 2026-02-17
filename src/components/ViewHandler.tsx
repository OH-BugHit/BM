import { useSetAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router';
import { activeViewAtom } from '../atoms/state';
import { TeacherDialogs, TeacherViews } from '../utils/types';
import React from 'react';

function ViewHandler() {
    const [searchParams] = useSearchParams();
    const setView = useSetAtom(activeViewAtom);
    const navigate = useNavigate();

    const view = searchParams.get('view') as TeacherViews;
    const overlay = (searchParams.get('overlay') ?? 'none') as TeacherDialogs;

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
