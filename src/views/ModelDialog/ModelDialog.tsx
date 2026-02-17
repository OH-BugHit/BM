import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import {
    activeViewAtom,
    configAtom,
    currentModelInfoAtom,
    labelsAtom,
    modelAtom,
    modelDataAtom,
    modelListAtom,
    shareModelAtom,
} from '../../atoms/state';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback, useRef, useState } from 'react';
import { Autocomplete, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { LargeButton } from '@genai-fi/base';
import { loadLabels, loadModel } from '../../services/loadModel';
import { ModelInfo, ModelOrigin } from '../../utils/types';
import { currentModelName, handleFileChange } from './utils';
import { useLocation, useNavigate } from 'react-router';

function ModelDialog() {
    const { t, i18n } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const setModel = useSetAtom(modelAtom);
    const [config, setConfig] = useAtom(configAtom);
    const setModelFile = useSetAtom(modelDataAtom);
    const modelList = useAtomValue(modelListAtom);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedModel, setSelectedModel] = useState('');
    const activeView = useAtomValue(activeViewAtom);
    const setLabels = useSetAtom(labelsAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const setShare = useSetAtom(shareModelAtom);
    const setCurrentInfo = useSetAtom(currentModelInfoAtom);

    const doClose = useCallback(() => {
        const params = new URLSearchParams(location.search);
        params.set('overlay', 'none');
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }, [location, navigate]);

    const doCloseAccept = useCallback(
        (modelInfo: ModelInfo) => {
            const params = new URLSearchParams(location.search);
            params.set('origin', modelInfo.origin);
            params.set('model', modelInfo.name);
            params.set('overlay', 'none');
            navigate(`${location.pathname}?${params.toString()}`, { replace: false });
        },
        [location, navigate]
    );

    const openFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAccept = async () => {
        if (!selectedFile && selectedModel.length === 0) return;
        setShare(false);
        if (selectedModel.length > 0) {
            setLoading(true);
            const modelInfo = { origin: ModelOrigin.GenAI, name: selectedModel };

            setCurrentInfo(modelInfo); // Sets current modelInfo as current atom state.
            try {
                const model = await loadModel(modelInfo);
                console.log(model);

                setModel(model);
                const labels = await loadLabels({
                    language: i18n.language,
                    modelName: modelInfo.name,
                });
                if (labels) {
                    setLabels((old) => {
                        const newLabels = new Map<string, string>(old.labels);
                        Object.entries(labels).forEach(([label, translation]) => {
                            newLabels.set(label as string, translation as string);
                        });
                        return { labels: newLabels };
                    });
                } else {
                    setLabels((old) => {
                        // Default fallback to model.getLabels!
                        const newLabels = new Map<string, string>(old.labels);
                        const labelList = model?.getLabels() ?? [];
                        labelList.forEach((label) => {
                            newLabels.set(label, label);
                        });
                        return { labels: newLabels };
                    });
                }
                setConfig((old) => ({
                    ...old,
                    pause: true,
                    modelData: { name: selectedModel, origin: ModelOrigin.GenAI },
                }));
                doCloseAccept(modelInfo);
            } catch (e) {
                console.error('Mallin lataus epäonnistui', e);

                setCurrentInfo({ name: 'error', origin: ModelOrigin.Local }); // Sets current modelInfo as current atom state.
            } finally {
                setLoading(false);
            }
        } else if (selectedFile) {
            setModelFile(selectedFile);
            setLoading(true);
            const url = URL.createObjectURL(selectedFile);
            const modelLoadingObject: ModelInfo = { origin: ModelOrigin.Local, name: url };
            try {
                const model = await loadModel(modelLoadingObject);
                setModel(model);
                setLabels((old) => {
                    // Default fallback to model.getLabels! So if it not our model it has labels from the model.getLabels.
                    const newLabels = new Map<string, string>(old.labels);
                    const labelList = model?.getLabels() ?? [];
                    labelList.forEach((label) => {
                        newLabels.set(label, label);
                    });
                    return { labels: newLabels };
                });
                setConfig((old) => ({ ...old, modelData: { name: selectedFile.name, origin: ModelOrigin.Local } }));
                doCloseAccept({ origin: ModelOrigin.Local, name: selectedFile.name.replace('.zip', '') });
                setShare(true); // Starts sharing local model
            } catch (err) {
                console.error('Mallin lataus epäonnistui', err);
            } finally {
                setLoading(false);
                URL.revokeObjectURL(url);
            }
        }
    };

    return (
        <Dialog
            open={activeView.overlay === 'modelChange'}
            onClose={doClose}
            maxWidth="md"
        >
            <DialogTitle className={style.title}>{t('teacher.titles.changeModel')}</DialogTitle>
            <DialogContent>
                {currentModelName({ config: config, t: t })}
                <div className={style.selectModelMessage}>
                    <div className={style.columnItem}>
                        {t('teacher.messages.selectModelGenAI')}
                        <Autocomplete
                            options={modelList || []}
                            value={selectedModel}
                            className={style.textField}
                            onChange={(_, newValue) => {
                                setSelectedModel(newValue || '');
                                setSelectedFile(null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('common.selectModel')}
                                />
                            )}
                        />
                    </div>
                    <div className={style.column}>
                        <div className={style.columnItem}>
                            <Trans
                                i18nKey="teacher.messages.selectOwnModel"
                                components={{
                                    Link: (
                                        <a
                                            href="https://tm.gen-ai.fi/image/general"
                                            target="_blank"
                                            rel="noreferrer"
                                        />
                                    ),
                                }}
                            />
                        </div>
                        <>
                            {selectedFile && (
                                <span style={{ marginLeft: 8, marginRight: 8, fontStyle: 'italic' }}>
                                    {selectedFile.name}
                                </span>
                            )}
                            <input
                                ref={fileInputRef}
                                id="openfile"
                                type="file"
                                accept=".zip"
                                style={{ display: 'none' }}
                                onChange={(e) =>
                                    handleFileChange({
                                        e: e,
                                        setSelectedFile: setSelectedFile,
                                        setSelectedModel: setSelectedModel,
                                    })
                                }
                            />
                            <IconButton
                                title={t('teacher.actions.openFileExplorer')}
                                onClick={openFile}
                                color="secondary"
                                size="large"
                                style={{ border: '1px solid rgb(174, 37, 174)' }}
                                aria-label={t('dashboard.labels.openTip')}
                            >
                                <FolderOpenIcon fontSize="medium" />
                            </IconButton>
                        </>
                    </div>
                </div>
                <div className={style.buttonGroup}>
                    <LargeButton
                        title={t('common.cancel')}
                        variant="contained"
                        color="primary"
                        onClick={doClose}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </LargeButton>
                    <LargeButton
                        title={loading ? t('teacher.actions.loadingModel') : t('teacher.actions.setModel')}
                        variant="contained"
                        color="secondary"
                        data-testid="teacher-start-button"
                        onClick={handleAccept}
                        disabled={(!selectedFile || loading) && selectedModel.length === 0}
                    >
                        {loading ? t('teacher.actions.loadingModel') : t('teacher.actions.setModel')}
                    </LargeButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default React.memo(ModelDialog);
