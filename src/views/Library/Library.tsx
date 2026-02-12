import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { configAtom, labelsAtom, modelAtom } from '../../atoms/state';
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
    const [, setConfig] = useAtom(configAtom);
    const [, setModel] = useAtom(modelAtom);
    const [, setLabels] = useAtom(labelsAtom);
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
            navigate(`/teacher/?modelOrigin=${ModelOrigin.GenAI}&model=${type}&view=userGridSimple&overlay=share`);
        }
    };

    // Handler for file input change (own model)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const modelInfo = { origin: ModelOrigin.Teacher, name: file.name };
            const loadedModel = await loadModel({ origin: ModelOrigin.Teacher, name: url });
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
            }
            URL.revokeObjectURL(url);
            navigate(
                `/teacher/?modelOrigin=${modelInfo.origin}&model=${modelInfo.name}&view=userGridSimple&overlay=share`
            );
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
