import { usePeer, ConnectionStatus, Connection } from '@knicos/genai-base';
import { useCallback, useEffect } from 'react';
import { EventProtocol } from './protocol';
import { useAtom } from 'jotai';
import { configAtom, studentDataAtom } from '../atoms/state';
import { SpoofConfig } from '../utils/types';
import { base64ToCanvas } from '../utils/base64toCanvas';

export default function ServerProtocol({ code }: { code: string }) {
    const [config] = useAtom<SpoofConfig>(configAtom);
    const [, setStudentAtom] = useAtom(studentDataAtom);
    const closeHandler = useCallback(() => {}, []);
    const dataHandler = useCallback(
        (data: EventProtocol, conn: Connection<EventProtocol>) => {
            // Jatka onData tänne lisää
            if (data.event === 'eter:join') {
                console.log('Join command');
                console.log(data);
                conn.send({ event: 'eter:config', configuration: { data: config.data, pause: true } });
                // Send
            } else if (data.event === 'eter:score') {
                console.log('Score command', data); // vastaanotetaan opiskelijan pisteet
            } else if (data.event === 'eter:image') {
                console.log('Image command', data); // vastaanotetaan opiskelijan kuva
                // Tallennetaan opiskelijan data
                (async () => {
                    const topCanvas = await base64ToCanvas(data.data.image);
                    const topHeatmap = await base64ToCanvas(data.data.heatmap);
                    const score = data.data.score;
                    setStudentAtom((prev) => {
                        const id = data.data.studentId; // kovakoodattu id toistaiseksi
                        // Luo uusi StudentScores jos ei ole
                        const prevStudents = prev?.students ?? new Map();
                        const studentScores = prevStudents.get(id) ?? { data: new Map() };
                        // Päivitä tämän classnamen tiedot
                        studentScores.data.set(data.data.classname, {
                            score,
                            topCanvas,
                            topHeatmap,
                        });
                        prevStudents.set(id, studentScores);
                        return { students: prevStudents };
                    });
                })();
            }
        },
        [setStudentAtom, config.data]
    );

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
            visibility={1}
        />
    );
}
