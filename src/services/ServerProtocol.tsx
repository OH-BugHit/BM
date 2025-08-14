import { ConnectionStatus, Connection } from '@genai-fi/base';
import { useEffect } from 'react';
import { EventProtocol } from './protocol';
import { useAtom } from 'jotai';
import {
    takenUsernamesAtom,
    configAtom,
    studentDataAtom,
    usersAtom,
    modelDataAtom,
    profilePicturesAtom,
    termTransferAtom,
    messageTransferAtom,
} from '../atoms/state';
import { SpoofConfig, StudentScores } from '../utils/types';
import { base64ToCanvas } from '../utils/base64toCanvas';
import { canvasToBase64 } from '../utils/canvasToBase64';
import { usePeerClose, usePeerData, usePeerSender } from '@genai-fi/base/hooks/peer';

export default function ServerProtocol() {
    const [config] = useAtom<SpoofConfig>(configAtom);
    const [, setStudent] = useAtom(studentDataAtom);
    const [users, setUsers] = useAtom(usersAtom);
    const [profilePictures, setProfilePictures] = useAtom(profilePicturesAtom);
    const [allUNs, setAllUNs] = useAtom(takenUsernamesAtom);
    const [modelFile] = useAtom(modelDataAtom);
    const [termData] = useAtom(termTransferAtom);
    const [messageData] = useAtom(messageTransferAtom);

    // CLOSE HANDLER: whenever a Connection is closed (either via 'eter:close' or network drop),
    // remove that user from your usersAtom.
    usePeerClose((conn?: Connection<EventProtocol>) => {
        if (conn) {
            setUsers((old) => old.filter((user) => user.connectionId !== conn.connectionId));
        }
    });

    usePeerData((data: EventProtocol, conn: Connection<EventProtocol>) => {
        if (data.event === 'eter:join') {
            conn.send({
                event: 'eter:config',
                configuration: {
                    pause: config.pause,
                    heatmap: config.heatmap,
                    gallery: config.gallery,
                    modelData: config.modelData,
                    gameMode: config.gameMode,
                    settings: config.settings,
                },
            });
            conn.send({
                event: 'eter:termData',
                data: {
                    term: termData.term,
                    recipient: { username: 'a' },
                },
            });
            conn.send({
                event: 'eter:userlist',
                available: allUNs.filter((u) => !users.some((user) => user.username === u.username)), // Filters users dropped from the users
                taken: allUNs.filter((u) => users.some((user) => user.username === u.username)), // Filters users still connected
            });
        } else if (data.event === 'eter:drop') {
            setUsers((old) => old.filter((o) => o.username !== data.data.username));
        } else if (data.event === 'eter:register') {
            const idx = users.findIndex((u) => u.username === data.data.username);
            if (idx !== -1) {
                // Dublicate user!
                console.log('users have tried to enter with same username. No dublicates allowed.'); // Sends reload command back to same connection, not by username as it is dublicate in this case!
                conn.send({
                    event: 'eter:messageUser',
                    message: 'usernameTaken',
                    reload: true,
                    action: 'bouncer',
                });
                return;
            }
            setUsers((old) => [
                ...old,
                {
                    username: data.data.username,
                    connectionId: conn.connectionId,
                },
            ]);
            setAllUNs((old) => {
                // Lisää vain jos käyttäjänimi ei ole jo listassa
                if (old.some((u) => u.username === data.data.username)) {
                    return old;
                }
                return [...old, { username: data.data.username }];
            });
            if (data.data.profilePicture.length > 0) {
                (async () => {
                    const profilePic = await base64ToCanvas(data.data.profilePicture);
                    setProfilePictures((prev) => {
                        const id = data.data.username;
                        const prevMap = new Map(prev);
                        prevMap.set(id, profilePic);
                        return prevMap;
                    });
                })();
            } else {
                const canvas = profilePictures.get(data.data.username);
                if (canvas) {
                    const profilePic = canvasToBase64(canvas);
                    conn.send({
                        event: 'eter:profilePicture',
                        data: {
                            username: data.data.username,
                            profilePicture: profilePic,
                        },
                    });
                }
            }
        } else if (data.event === 'eter:modelRequest') {
            if (modelFile) {
                conn.send({
                    event: 'eter:modelTransfer',
                    data: modelFile,
                });
            } else {
                console.log('Modelfile not found when requested by student');
            }
        } else if (data.event === 'eter:image') {
            if (data.data.image === 'delete') {
                setStudent((prev) => {
                    const newData = prev?.students ?? new Map();
                    const studentScores: StudentScores = newData.get(data.data.studentId) ?? { data: new Map() };
                    studentScores.data.delete(data.data.classname);
                    return { students: newData };
                });
            }
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
                        existing.score = score;
                        existing.topCanvas = topCanvas;
                        existing.topHeatmap = topHeatmap;
                        existing.hidden = data.data.hidden;
                    } else {
                        studentScores.data.set(data.data.classname, {
                            score,
                            topCanvas,
                            topHeatmap,
                            hidden: data.data.hidden,
                        });
                    }
                    prevStudents.set(id, studentScores);
                    return { students: prevStudents };
                });
            })();
        }
    });

    const send = usePeerSender<EventProtocol>();

    useEffect(() => {
        if (send) send({ event: 'eter:config', configuration: config });
    }, [config, send]);

    useEffect(() => {
        if (send) send({ event: 'eter:termData', data: termData });
    }, [termData, send]);

    useEffect(() => {
        if (send) send({ event: 'eter:messageUser', ...messageData });
    }, [messageData, send]);

    return (
        <ConnectionStatus
            api={import.meta.env.VITE_APP_APIURL}
            appName={'spoofgame'}
            visibility={3}
        />
    );
}
