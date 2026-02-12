import { useAtomValue } from 'jotai';
import { gameStartedAtom } from '../../../atoms/state';
import Loading from '../../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

interface Props {
    message?: string;
}
export default function GameLoading({ message }: Props) {
    const { t } = useTranslation();
    const gameReady = useAtomValue(gameStartedAtom);

    return (
        <Loading
            loading={!gameReady}
            message={message || t('loader.messages.loadingModel')}
        />
    );
}
