import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enGB from '../../public/locales/en-GB/translation.json';
import fiFI from '../../public/locales/fi-FI/translation.json';
import frFR from '../../public/locales/fr-FR/translation.json';

i18n.use(initReactI18next).init({
    lng: 'en-GB',
    fallbackLng: 'en-GB',
    resources: {
        'en-GB': {
            translation: enGB,
        },
        'fi-FI': {
            translation: fiFI,
        },
        'fr-FR': {
            translation: frFR,
        },
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
