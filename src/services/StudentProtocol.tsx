import { ConnectionStatus, usePeer } from '@knicos/genai-base';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { EventProtocol } from './protocol';
import { ImageData, ScoreData } from '../utils/types';
import { useAtom } from 'jotai';
import { configAtom } from '../atoms/state';

interface Props extends PropsWithChildren {
    server?: string;
    mycode?: string;
}

interface ProtocolContextType {
    doSendScore?: (data: ScoreData) => void; // Do interface and send also the image
    doSendImages?: (data: ImageData) => void; // TODO: Send image here
}

const ProtocolContext = createContext<ProtocolContextType>({});

// eslint-disable-next-line react-refresh/only-export-components
export function useSpoofProtocol() {
    return useContext(ProtocolContext);
}
export default function StudentProtocol({ server, mycode, children }: Props) {
    const [, setConfig] = useAtom(configAtom);
    // conn: Connection<EventProtocol>
    const dataHandler = useCallback(
        (data: EventProtocol) => {
            if (data.event === 'eter:join') {
                console.log('Join command');
                // Send
            } else if (data.event === 'eter:config') {
                console.log('New config received: ', data.configuration);
                setConfig(data.configuration);
            }
        },
        [setConfig]
    );
    const [hasBeenReady, setHasBeenReady] = useState(false);

    const { ready, send, peer } = usePeer({
        host: import.meta.env.VITE_APP_PEER_SERVER,
        secure: import.meta.env.VITE_APP_PEER_SECURE === '1',
        key: import.meta.env.VITE_APP_PEER_KEY || 'peerjs',
        port: import.meta.env.VITE_APP_PEER_PORT ? parseInt(import.meta.env.VITE_APP_PEER_PORT) : 443,
        code: `spoof_${mycode}`,
        onData: dataHandler,
        server: `spoof_${server}`,
    });

    useEffect(() => {
        setHasBeenReady(true);
    }, [ready]);

    const doSendScore = useCallback(
        (score: ScoreData) => {
            if (send) {
                send({ event: 'eter:score', data: score });
            }
        },
        [send]
    );

    const doSendImages = useCallback(
        (images: ImageData) => {
            if (send) {
                send({ event: 'eter:image', data: images });
            }
        },
        [send]
    );

    return (
        <ProtocolContext.Provider
            value={{
                doSendScore,
                doSendImages,
            }}
        >
            {hasBeenReady && children}
            <ConnectionStatus
                api={import.meta.env.VITE_APP_APIURL}
                appName={'spoofgame'}
                ready={ready}
                peer={peer}
                visibility={3}
            />
        </ProtocolContext.Provider>
    );
}
