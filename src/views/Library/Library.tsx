import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { configAtom, modelAtom } from '../../atoms/state';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import style from './style.module.css';
import Footer from '../../components/Footer/Footer';
import ContentItem from './ContentItem';
import { loadModel } from '../../services/loadModel';
import { ModelOrigin } from '../../utils/types';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Library() {
    const { t } = useTranslation();
    const [, setConfig] = useAtom(configAtom);
    const [, setModel] = useAtom(modelAtom);
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
            if (loadedModel) {
                setModel(loadedModel);
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
            <Footer />
        </main>
    );
}
