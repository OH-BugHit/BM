import { useNavigate, useSearchParams } from 'react-router';
import { loadLabels, loadModel } from '../services/loadModel';
import { ModelInfo, ModelOrigin } from './types';
import i18n from '../i18n';
import { useSetAtom } from 'jotai';
import { configAtom, labelsAtom, modelAtom } from '../atoms/state';
import GameLoading from '../views/Student/WebcamInput/GameLoading';
import { useTranslation } from 'react-i18next';

export default function ModelLoader() {
    const { t } = useTranslation();
    const [serachParams] = useSearchParams();
    const modelOrigin = serachParams.get('modelOrigin') as ModelOrigin;
    const modelName = serachParams.get('model');
    const navigate = useNavigate();
    const setModel = useSetAtom(modelAtom);
    const setLabels = useSetAtom(labelsAtom);
    const setConfig = useSetAtom(configAtom);

    const handleGenAILoad = async (type: 'jobs' | 'animals') => {
        // Load Gen-AI model
        const modelInfo = {
            origin: ModelOrigin.GenAI,
            name: type,
        } as ModelInfo;
        const loadedModel = await loadModel(modelInfo);
        const labels = await loadLabels({ language: i18n.language, modelName: modelInfo.name });
        if (loadedModel) {
            setModel(loadedModel);
            setLabels((old) => {
                const newLabels = new Map<string, string>(old.labels);
                Object.entries(labels).forEach(([label, translation]) => {
                    newLabels.set(label as string, translation as string);
                });
                return { labels: newLabels };
            });
            setConfig((old) => ({
                ...old,
                modelData: modelInfo,
            }));
        }
    };

    if (modelOrigin && modelOrigin.length > 0 && modelName && modelName.length > 0) {
        console.log('Loading model from URL parameters:', { modelOrigin, modelName });
        if (modelOrigin === ModelOrigin.GenAI) {
            console.log('load genai model');
            handleGenAILoad(modelName as 'jobs' | 'animals');
        } else if (modelOrigin === ModelOrigin.Teacher) {
            console.warn(
                'Model should have been loaded already. Try loading the model again at "select classification task" view'
            );
        } else if (modelOrigin === ModelOrigin.TM) {
            console.log('not implemented yet');
        }
    } else {
        console.warn('Model parameters missing in URL, redirecting to library');
        navigate('/library');
    }

    return (
        <>
            <GameLoading message={t('modelLoader.loading')} />
        </>
    );
}
