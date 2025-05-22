import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Button } from '@knicos/genai-base';
import ImageViewer from '../../../components/ImageViewer/ImageViewer';
import { useAtom } from 'jotai';
import { classificationResultAtom, currentImageAtom, imageCacheAtom, modelAtom } from '../../../atoms/state';
import { useEffect } from 'react';
import { loadMobileNetModel } from '../../../services/loadModel';
import { classifyImage } from '../../../utils/classifyImage';
import { ClassificationResults } from '../../../components/ClassificationResults/ClassificationResults';

export default function ReadyGame() {
    const { t } = useTranslation();
    const [currentImage, setCurrentImage] = useAtom(currentImageAtom); // Välimuisti vuorossa olevalle kuvalle
    const [, setClassificationResult] = useAtom(classificationResultAtom); // Välimuisti luokittelutulokselle
    const [cache] = useAtom(imageCacheAtom); // Välimuisti kuvien välimuistille
    const allImages = ['teacher_female1.jpg', 'teacher_female2.jpg', 'teacher_female3.jpg']; // Tiedostonimet, tee hakemaan ensin nämä ja sekoita järjestys, tai että pyytää vaikka kolme nimeä tms muuta.
    // Voidaan myös tallentaa jotaihin nämä ja varmaan kannattaakin?

    const [model, setModel] = useAtom(modelAtom);

    useEffect(() => {
        if (model === null) {
            loadMobileNetModel().then(setModel);
            console.log('Model now loaded');
        } else {
            console.log('Model already loaded');
        }
    }, [model, setModel]);

    useEffect(() => {
        if (!currentImage) {
            setClassificationResult(null);
        }
    }, [currentImage, setClassificationResult]);

    const goNextImage = () => {
        if (!currentImage) {
            setCurrentImage(allImages[0]); // Aseta ensimmäinen kuva, jos ei ole asetettu
            return;
        }
        const index = allImages.indexOf(currentImage);
        const next = allImages[index + 1];
        if (next) setCurrentImage(next);
    };

    // Luokittelu
    useEffect(() => {
        const classify = async () => {
            if (!model || !currentImage) return;
            const imageUrl = cache[currentImage];
            if (!imageUrl) return;

            try {
                const results = await classifyImage(model, imageUrl);
                setClassificationResult(results.slice(0, 3)); // 3 parasta
            } catch (err) {
                console.error('Luokittelu epäonnistui:', err);
                setClassificationResult(null);
            }
        };

        classify();
    }, [model, currentImage, cache, setClassificationResult]);

    return (
        <div className={style.container}>
            <Header title={t('common.title')} />
            <div className={style.innerContainer}>
                <h2>{t('game.ready.title')}</h2>
                <ImageViewer />
                <ClassificationResults />
                <Button
                    sx={{ fontSize: '14pt', minWidth: '140px' }}
                    variant="contained"
                    onClick={goNextImage}
                >
                    Seuraava kuva {/* && currentImage ja sit ensimmäinen kuva *TODO: Kielellistys*/}
                </Button>
                {/**Tähän tulee jotain alkuasetteluja */}
                {/**Tähän tulee valmis pelin aloituspainike, jonka painalluksen jälkeen peli alkaa */}
                {/*&&ready niin renderöityy kuva, johon sitten */}
            </div>
            <Footer />
        </div>
    );
}
