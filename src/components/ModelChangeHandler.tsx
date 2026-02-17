import { useAtomValue } from 'jotai';
import { currentModelInfoAtom } from '../atoms/state';
import { useNavigate, useSearchParams } from 'react-router';
import { ModelOrigin } from '../utils/types';
import { useEffect } from 'react';
import { useLoadModelAndShare } from '../hooks/useLoadModelAndShare';

export default function ModelChangeHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentModelInfo = useAtomValue(currentModelInfoAtom);
    const { loadAndShare } = useLoadModelAndShare();

    const modelOrigin = searchParams.get('origin') as ModelOrigin;
    const modelName = searchParams.get('model') as string;

    useEffect(() => {
        if (!modelOrigin || !modelName || modelOrigin.length === 0 || modelName.length === 0) {
            console.warn('Missing URL parameters, redirecting to library');
            navigate('/library/', { replace: true });
            return;
        }

        // Tarkista onko malli muuttunut
        if (currentModelInfo?.name !== modelName || currentModelInfo?.origin !== modelOrigin) {
            console.log('Model changed, loading:', { modelName, modelOrigin });

            if (modelOrigin === ModelOrigin.GenAI || modelOrigin === ModelOrigin.Remote) {
                loadAndShare(modelOrigin, modelName);
            } else if (modelOrigin === ModelOrigin.Local) {
                console.log('Local model - is be handled in library view or model dialog');
            }
        }
    }, [modelOrigin, modelName, currentModelInfo, navigate, loadAndShare]);

    return null;
}
