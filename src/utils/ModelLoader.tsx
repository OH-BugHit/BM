import { useNavigate, useSearchParams } from 'react-router';
import { ModelOrigin } from './types';
import GameLoading from '../views/Student/WebcamInput/GameLoading';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect } from 'react';
import { useLoadModelAndShare } from '../hooks/useLoadModelAndShare';

export default function ModelLoader() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const modelOrigin = searchParams.get('origin') as ModelOrigin;
    const modelName = searchParams.get('model');
    const navigate = useNavigate();
    const { loadAndShare } = useLoadModelAndShare();

    useLayoutEffect(() => {
        if (!modelOrigin || !modelName) {
            console.warn('Model parameters missing in URL, redirecting to library');
            navigate('/library');
            return;
        }

        console.log('Loading model from URL parameters:', { modelOrigin, modelName });

        if (modelOrigin === ModelOrigin.GenAI || modelOrigin === ModelOrigin.Remote) {
            loadAndShare(modelOrigin, modelName);
        } else if (modelOrigin === ModelOrigin.Local) {
            console.warn(
                'Model should have been loaded already. Try loading the model again at "select classification task" view'
            );
            navigate('/library');
        }
    }, [modelOrigin, modelName, navigate, loadAndShare]);

    return (
        <>
            <GameLoading message={t('modelLoader.loading')} />
        </>
    );
}
