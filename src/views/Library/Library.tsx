import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { configAtom, labelsAtom, modelAtom } from '../../atoms/state';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import style from './style.module.css';
import Footer from '../../components/Footer/Footer';
import ContentItem from './ContentItem';
import { loadLabels, loadModel } from '../../services/loadModel';
import { ModelOrigin } from '../../utils/types';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Library() {
    const { t, i18n } = useTranslation();
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
            // Load Gen-AI model
            const modelInfo = {
                origin: ModelOrigin.GenAI,
                name: type,
            };
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
            navigate('/teacher/');
        }
    };

    // Handler for file input change (own model)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const modelInfo = { origin: ModelOrigin.Teacher, name: file.name };
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
            }
            URL.revokeObjectURL(url);
        }
        navigate('/teacher/');
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
