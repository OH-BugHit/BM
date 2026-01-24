import { useAtomValue } from 'jotai';
import { gameStartedAtom } from '../../../atoms/state';
import Loading from '../../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

export default function GameLoading() {
    const { t } = useTranslation();
    const gameReady = useAtomValue(gameStartedAtom);

    return (
        <Loading
            loading={!gameReady}
            message={t('loader.messages.loadingModel')}
        />
    );
}
