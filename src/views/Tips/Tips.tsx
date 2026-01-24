import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { Button } from '@genai-fi/base';
import Tip from './Tip';
import { useAtom, useAtomValue } from 'jotai';
import { guidanceActiveAtom, guidanceStepAtom, showTipsAtom } from '../../atoms/state';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Tips() {
    const { t } = useTranslation();
    const guidance = useAtomValue(guidanceActiveAtom);
    const step = useAtomValue(guidanceStepAtom);
    const [show, setShowTips] = useAtom(showTipsAtom);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        setHide(false);
    }, [show, setHide, step]);
    if (!guidance || step < 1 || !show) return null;

    return (
        <AnimatePresence mode="wait">
            {guidance && step >= 1 && show && !hide && (
                <motion.div
                    key="tips"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className={style.tipsContainer}
                >
                    <Button
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0rem',
                            zIndex: 3,
                            background: '#ffffffe7',
                            width: 32,
                            height: 32,
                            fontSize: 24,
                            cursor: 'pointer',
                        }}
                        title={t('common.close')}
                        aria-label="Sulje"
                        onClick={() => setHide(true)}
                    >
                        <CloseSharpIcon />
                    </Button>

                    <h3>{t(`guide.normal.steps.${step}.title`)}</h3>
                    <Tip step={step} />

                    <Button
                        style={{ position: 'absolute', right: '1rem', bottom: '0.1rem' }}
                        title={t('guide.common.hideTips')}
                        aria-label="Sulje"
                        onClick={() => setShowTips(false)}
                    >
                        {t('guide.common.hideTips')}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
