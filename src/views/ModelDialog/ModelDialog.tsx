import style from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { configAtom, menuShowModelChangeAtom, modelAtom, modelDataAtom, modelListAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { Autocomplete, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { LargeButton } from '@genai-fi/base';
import { loadModel } from '../../services/loadModel';
import { ModelInfo, ModelOrigin } from '../../utils/types';

export default function ModelDialog() {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useAtom(menuShowModelChangeAtom);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [, setModel] = useAtom(modelAtom);
    const [config, setConfig] = useAtom(configAtom);
    const [, setModelFile] = useAtom(modelDataAtom);
    const [modelList] = useAtom(modelListAtom);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedModel, setSelectedModel] = useState('');

    const doClose = useCallback(() => setShowDialog(false), [setShowDialog]);

    const openFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setSelectedModel('');
        }
    };

    const currentModelName = () => {
        if (config.modelData.origin === ModelOrigin.GenAI) {
            return `${t('teacher.labels.currentModel')}: ${config.modelData.name} ${t('teacher.labels.from')} ${
                config.modelData.origin
            }`;
        } else if (config.modelData.origin === ModelOrigin.Teacher) {
            return `${t('teacher.labels.currentModel')}: ${config.modelData.name.slice(0, -4)} ${t(
                'teacher.labels.from'
            )} ${config.modelData.origin}`;
        } else return '';
    };

    const handleAccept = async () => {
        if (!selectedFile && selectedModel.length === 0) return;
        if (selectedModel.length > 0) {
            setLoading(true);
            const modelInfo = { origin: ModelOrigin.GenAI, name: selectedModel };
            try {
                const model = await loadModel(modelInfo);
                setModel(model);
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
            open={showDialog}
            onClose={doClose}
            maxWidth="md"
        >
            <DialogTitle className={style.title}>{t('teacher.titles.changeModel')}</DialogTitle>
            <DialogContent>
                {currentModelName()}
                <div className={style.selectModelMessage}>
                    <div className={style.columnItem}>
                        {t('teacher.messages.selectModelGenAI')}
                        <Autocomplete
                            options={modelList || []}
                            value={selectedModel}
                            style={{
                                padding: '4px',
                                margin: '1rem',
                                minWidth: '300px',
                                maxWidth: '600px',
                                width: '100%',
                            }}
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
                        <div>
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
                                onChange={handleFileChange}
                            />
                            <IconButton
                                onClick={openFile}
                                color="secondary"
                                size="large"
                                style={{ border: '1px solid rgb(174, 37, 174)' }}
                                aria-label={t('dashboard.labels.openTip')}
                            >
                                <FolderOpenIcon fontSize="medium" />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className={style.buttonGroup}>
                    <LargeButton
                        variant="contained"
                        color="primary"
                        onClick={doClose}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </LargeButton>
                    <LargeButton
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
