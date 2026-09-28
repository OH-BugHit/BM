import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enGB from '../../public/locales/en-GB/translation.json';
import fiFI from '../../public/locales/fi-FI/translation.json';
import svSE from '../../public/locales/sv-SE/translation.json';

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
        'sv-SE': {
            translation: svSE,
        },
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
