import { useSetAtom } from 'jotai';
import { configAtom, currentModelInfoAtom, labelsAtom, modelAtom, shareModelAtom } from '../atoms/state';
import { ModelInfo, ModelOrigin } from '../utils/types';
import { loadLabels, loadModel } from '../services/loadModel';
import i18n from '../i18n';
import { useCallback } from 'react';

export const useLoadModelAndShare = () => {
    const setModel = useSetAtom(modelAtom);
    const setCurrentInfo = useSetAtom(currentModelInfoAtom);
    const setLabels = useSetAtom(labelsAtom);
    const setConfig = useSetAtom(configAtom);
    const setShare = useSetAtom(shareModelAtom);

    const loadAndShare = useCallback(
        async (origin: ModelOrigin, modelName: string) => {
            try {
                const modelInfo: ModelInfo = {
                    origin,
                    name: modelName,
                };

                let loadedModel;
                let labels: Record<string, string> = {};

                // Load model by origin
                if (origin === ModelOrigin.GenAI) {
                    loadedModel = await loadModel(modelInfo);
                    labels = (await loadLabels({ language: i18n.language, modelName })) || {};
                } else if (origin === ModelOrigin.Remote) {
                    loadedModel = await loadModel(modelInfo);
                    setShare(true);
                } else if (origin === ModelOrigin.Local) {
                    loadedModel = await loadModel(modelInfo);
                    setShare(true);
                }

                if (!loadedModel) {
                    console.error(`Failed to load model: ${origin} - ${modelName}`);
                    return false;
                }

                // Set model and send students new model info via config
                setModel(loadedModel);
                setCurrentInfo(modelInfo);
                setConfig((old) => ({
                    ...old,
                    modelData: modelInfo,
                }));

                // Load labels based on origin
                if (origin === ModelOrigin.GenAI && Object.keys(labels).length > 0) {
                    // GenAI labels come from loadLabels() with translations
                    setLabels((old) => {
                        const newLabels = new Map<string, string>(old.labels ?? []);
                        Object.entries(labels).forEach(([label, translation]) => {
                            newLabels.set(label, translation as string);
                        });
                        return { labels: newLabels };
                    });
                } else if ((origin === ModelOrigin.Remote || origin === ModelOrigin.Local) && loadedModel) {
                    // Remote and Local labels come from model.getLabels()
                    setLabels((old) => {
                        const newLabels = new Map<string, string>(old.labels ?? []);
                        const labelList = loadedModel.getLabels() ?? [];
                        labelList.forEach((label: string) => {
                            newLabels.set(label, label);
                        });
                        return { labels: newLabels };
                    });
                }

                return true;
            } catch (error) {
                console.error('Error loading model:', error);
                return false;
            }
        },
        [setModel, setCurrentInfo, setLabels, setConfig, setShare]
    );

    return { loadAndShare };
};
