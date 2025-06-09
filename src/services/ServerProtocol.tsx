import { usePeer, ConnectionStatus, Connection } from '@knicos/genai-base';
import { useCallback, useEffect } from 'react';
import { EventProtocol } from './protocol';
import { useAtom } from 'jotai';
import { configAtom } from '../atoms/state';
import { SpoofConfig } from '../utils/types';

export default function ServerProtocol({ code }: { code: string }) {
    const [config] = useAtom<SpoofConfig>(configAtom);
    const closeHandler = useCallback(() => {}, []);
    const dataHandler = useCallback((data: EventProtocol, conn: Connection<EventProtocol>) => {
        // Jatka onData tänne lisää
        if (data.event === 'eter:join') {
            console.log('Join command');
            conn.send({ event: 'eter:config', configuration: { data: `asd` } });
            // Send
        }
        if (data.event === 'eter:score') {
            console.log('Score command', data); // vastaanotetaan opiskelijan pisteet
        }
    }, []);

    const { ready, send, peer } = usePeer({
        host: import.meta.env.VITE_APP_PEER_SERVER,
        secure: import.meta.env.VITE_APP_PEER_SECURE === '1',
        key: import.meta.env.VITE_APP_PEER_KEY || 'peerjs',
        port: import.meta.env.VITE_APP_PEER_PORT ? parseInt(import.meta.env.VITE_APP_PEER_PORT) : 443,
        code: `spoof_${code}`,
        onData: dataHandler,
        onClose: closeHandler,
    });

    useEffect(() => {
        if (send) send({ event: 'eter:config', configuration: config });
    }, [config, send]);

    return (
        <ConnectionStatus
            api={import.meta.env.VITE_APP_APIURL}
            appName={'spoofgame'}
            ready={ready}
            peer={peer}
            visibility={3}
        />
    );
}
