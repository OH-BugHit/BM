import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { activeViewAtom, configAtom, labelsAtom, modelAtom, modelDataAtom, modelListAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { Autocomplete, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { LargeButton } from '@genai-fi/base';
import { loadLabels, loadModel } from '../../services/loadModel';
import { ModelInfo, ModelOrigin } from '../../utils/types';
import { currentModelName, handleFileChange } from './utils';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';

export default function ModelDialog() {
    const { t, i18n } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [, setModel] = useAtom(modelAtom);
    const [config, setConfig] = useAtom(configAtom);
    const [, setModelFile] = useAtom(modelDataAtom);
    const [modelList] = useAtom(modelListAtom);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedModel, setSelectedModel] = useState('');
    const [activeView, setActiveView] = useAtom(activeViewAtom);
    const [, setLabels] = useAtom(labelsAtom);

    const doClose = useCallback(() => setActiveView((old) => ({ ...old, overlay: 'none' })), [setActiveView]);
    useModelNamesLoader();

    const openFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAccept = async () => {
        if (!selectedFile && selectedModel.length === 0) return;
        if (selectedModel.length > 0) {
            setLoading(true);
            const modelInfo = { origin: ModelOrigin.GenAI, name: selectedModel };
            try {
                const model = await loadModel(modelInfo);
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
                setConfig((old) => ({ ...old, modelData: { name: selectedModel, origin: ModelOrigin.GenAI } }));
                doClose();
            } catch (e) {
                console.error('Mallin lataus epäonnistui', e);
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
                    // Default fallback to model.getLabels!
                    const newLabels = new Map<string, string>(old.labels);
                    const labelList = model?.getLabels() ?? [];
                    labelList.forEach((label) => {
                        newLabels.set(label, label);
                    });
                    return { labels: newLabels };
                });
                setConfig((old) => ({ ...old, modelData: { name: selectedFile.name, origin: ModelOrigin.Teacher } }));
                doClose();
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
