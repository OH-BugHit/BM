import { useAtom } from 'jotai';
import { gameStartedAtom } from '../../../atoms/state';
import { Spinner } from '@genai-fi/base';

export default function GameLoading() {
    const [gameReady] = useAtom(gameStartedAtom);

    return (
        <div>
            {!gameReady && (
                <span
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        zIndex: 1,
                        width: '100%',
                    }}
                >
                    <Spinner />
                </span>
            )}
        </div>
    );
}
