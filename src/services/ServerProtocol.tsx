import { usePeer, ConnectionStatus, Connection } from '@knicos/genai-base';
import { useCallback, useEffect } from 'react';
import { EventProtocol } from './protocol';
import { useAtom } from 'jotai';
import { usernamesAtom, configAtom, studentDataAtom, usersAtom } from '../atoms/state';
import { SpoofConfig } from '../utils/types';
import { base64ToCanvas } from '../utils/base64toCanvas';

export default function ServerProtocol({ code }: { code: string }) {
    const [config] = useAtom<SpoofConfig>(configAtom);
    const [, setStudent] = useAtom(studentDataAtom);
    const [users, setUsers] = useAtom(usersAtom);
    const [allUsers, setAllUsers] = useAtom(usernamesAtom);

    // CLOSE HANDLER: whenever a Connection is closed (either via 'eter:close' or network drop),
    // remove that user from your usersAtom.
    const closeHandler = useCallback(
        (conn?: Connection<EventProtocol>) => {
            if (conn) {
                setUsers((old) => old.filter((user) => user.connectionId !== conn.connectionId));
            }
        },
        [setUsers]
    );

    const dataHandler = useCallback(
        (data: EventProtocol, conn: Connection<EventProtocol>) => {
            if (data.event === 'eter:join') {
                console.log('Join command');
                conn.send({
                    event: 'eter:config',
                    configuration: { data: config.data, pause: config.pause },
                });
                conn.send({
                    event: 'eter:userlist',
                    data: allUsers.filter((u) => !users.some((user) => user.username === u.username)),
                });
            } else if (data.event === 'eter:drop') {
                setUsers((old) => old.filter((o) => o.username !== data.data.username));
            } else if (data.event === 'eter:score') {
                console.log('Score command', data);
            } else if (data.event === 'eter:register') {
                setUsers((old) => {
                    const idx = old.findIndex((u) => u.username === data.data.username);
                    if (idx !== -1) {
                        // Päivitä connectionId olemassa olevalle käyttäjälle
                        const updated = [...old];
                        updated[idx] = { ...updated[idx], connectionId: conn.connectionId };
                        return updated;
                    } else {
                        // Lisää uusi käyttäjä
                        return [...old, { username: data.data.username, connectionId: conn.connectionId }];
                    }
                });
                setAllUsers((old) => {
                    // Lisää vain jos käyttäjänimi ei ole jo listassa
                    if (old.some((u) => u.username === data.data.username)) {
                        return old;
                    }
                    return [...old, { username: data.data.username }];
                });
            } else if (data.event === 'eter:image') {
                console.log('Image command', data);
                (async () => {
                    const topCanvas = await base64ToCanvas(data.data.image);
                    const topHeatmap = await base64ToCanvas(data.data.heatmap);
                    const score = data.data.score;

                    setStudent((prev) => {
                        const id = data.data.studentId;
                        const prevStudents = prev?.students ?? new Map();
                        const studentScores = prevStudents.get(id) ?? { data: new Map() };

                        const existing = studentScores.data.get(data.data.classname);
                        if (existing) {
                            if (existing.score < score) {
                                existing.score = score;
                                existing.topCanvas = topCanvas;
                                existing.topHeatmap = topHeatmap;
                            }
                        } else {
                            studentScores.data.set(data.data.classname, {
                                score,
                                topCanvas,
                                topHeatmap,
                            });
                        }

                        prevStudents.set(id, studentScores);
                        return { students: prevStudents };
                    });
                })();
            }
        },
        [setStudent, setUsers, setAllUsers, allUsers, users, config.data, config.pause]
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
