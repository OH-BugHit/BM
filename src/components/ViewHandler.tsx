import { useAtom, useSetAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router';
import { activeViewAtom, configAtom, labelsAtom, modelAtom } from '../atoms/state';
import { ModelInfo, ModelOrigin, TeacherDialogs, TeacherViews } from '../utils/types';
import { loadLabels, loadModel } from '../services/loadModel';
import i18n from '../i18n';
import React from 'react';

function ViewHandler() {
    const [searchParams] = useSearchParams();
    const setView = useSetAtom(activeViewAtom);
    const navigate = useNavigate();
    const [model, setModel] = useAtom(modelAtom);
    const setLabels = useSetAtom(labelsAtom);
    const setConfig = useSetAtom(configAtom);

    const view = searchParams.get('view') as TeacherViews;
    const overlay = (searchParams.get('overlay') ?? 'none') as TeacherDialogs;
    const modelOrigin = searchParams.get('modelOrigin') as ModelOrigin;
    const modelName = searchParams.get('model') as string;

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

    if (!view || !overlay || !modelOrigin || !modelName || modelOrigin.length === 0 || modelName.length === 0) {
        console.warn('Missing URL parameters, redirecting to library');
        navigate('/library/', { replace: true });
        return null;
    }

    if (!model) {
        console.log('Loading model from URL parameters:', { modelOrigin, modelName });
        if (modelOrigin === ModelOrigin.GenAI) {
            console.log('load genai model');
            handleGenAILoad(modelName as 'jobs' | 'animals');
        } else if (modelOrigin === ModelOrigin.Teacher) {
            console.log('should been loaded already?');
        } else {
            console.log('loading TM model, implement here when needed');
        }
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
