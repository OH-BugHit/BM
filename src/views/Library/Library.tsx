import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { configAtom, currentModelInfoAtom, labelsAtom, modelAtom, shareModelAtom } from '../../atoms/state';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import style from './style.module.css';
import Footer from '../../components/Footer/Footer';
import ContentItem from './ContentItem';
import { loadModel } from '../../services/loadModel';
import { ModelOrigin } from '../../utils/types';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadGame from '../../components/Save_Load_Buttons/LoadButton';

export default function Library() {
    const { t } = useTranslation();
    const setConfig = useSetAtom(configAtom);
    const setModel = useSetAtom(modelAtom);
    const setLabels = useSetAtom(labelsAtom);
    const setShare = useSetAtom(shareModelAtom);
    const setCurrentInfo = useSetAtom(currentModelInfoAtom);
    useModelNamesLoader();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // Handler for clicking a ContentItem
    const handleItemClick = async (type: 'jobs' | 'animals' | 'own') => {
        if (type === 'own') {
            // Open file dialog for own model
            fileInputRef.current?.click();
        } else {
            // Navigate to teacher. Selected model is loaded in teacher view based on URL params
            navigate(`/teacher/?origin=${ModelOrigin.GenAI}&model=${type}&view=userGridSimple&overlay=share`);
        }
    };

    // Handler for file input change (own model)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const modelInfo = { origin: ModelOrigin.Local, name: file.name };
            const loadedModel = await loadModel({ origin: ModelOrigin.Local, name: url });
            if (loadedModel) {
                setModel(loadedModel);
                setLabels((old) => {
                    // Default fallback for labels = model.getLabels
                    const newLabels = new Map<string, string>(old.labels);
                    const labelList = loadedModel?.getLabels() ?? [];
                    labelList.forEach((label) => {
                        newLabels.set(label, label);
                    });
                    return { labels: newLabels };
                });
                setConfig((old) => ({
                    ...old,
                    modelData: modelInfo,
                }));
                setCurrentInfo(modelInfo);
                setShare(true);
                navigate(
                    `/teacher/?origin=${modelInfo.origin}&model=${modelInfo.name.replace('.zip', '')}&view=connect&overlay=share`
                );
            } else {
                console.error(
                    'Failed to load model from file. Make sure the file is a valid zip containing a model and try again.'
                );
                alert(
                    'Failed to load model from file. Make sure the file is a valid zip containing a model and try again.'
                );
            }
            URL.revokeObjectURL(url);
            return;
        }
        console.error('No file selected or file input error');
    };

    return (
        <main className={style.library}>
            <div className={style.content}>
                <h1>{t('library.title')}</h1>
                <ul className={style.grid}>
                    <ContentItem
                        title={t('library.jobs.title')}
                        image="/images/library/jobs.png"
                        description={t('library.jobs.description')}
                        onClick={() => handleItemClick('jobs')}
                    />
                    <ContentItem
                        title={t('library.animals.title')}
                        image="/images/library/animals.png"
                        description={t('library.animals.description')}
                        onClick={() => handleItemClick('animals')}
                    />
                    <ContentItem
                        title={t('library.own.title')}
                        image="/images/library/tm_fi.png"
                        description={t('library.own.description')}
                        onClick={() => handleItemClick('own')}
                    />
                    <LoadGame />
                </ul>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
            <Footer hideLang={false} />
        </main>
    );
}
