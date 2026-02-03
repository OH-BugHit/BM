import { ConnectionStatus, Connection } from '@genai-fi/base';
import { useEffect } from 'react';
import { EventProtocol } from './protocol';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    takenUsernamesAtom,
    configAtom,
    studentDataAtom,
    usersAtom,
    modelDataAtom,
    profilePicturesAtom,
    termTransferAtom,
    messageTransferAtom,
    studentActivityAtom,
    topScoresAtom,
} from '../atoms/state';
import { SpoofConfig, StudentScores } from '../utils/types';
import { base64ToCanvas } from '../utils/base64toCanvas';
import { canvasToBase64 } from '../utils/canvasToBase64';
import { usePeerClose, usePeerData, usePeerSender } from '@genai-fi/base/hooks/peer';
import { updateTopScores } from '../utils/updateTopScores';

export default function ServerProtocol() {
    const [users, setUsers] = useAtom(usersAtom);
    const [topScores, setTopScores] = useAtom(topScoresAtom);
    const [profilePictures, setProfilePictures] = useAtom(profilePicturesAtom);
    const [allUNs, setAllUNs] = useAtom(takenUsernamesAtom);
    const setStudent = useSetAtom(studentDataAtom);
    const setCurrentActivity = useSetAtom(studentActivityAtom);
    const config = useAtomValue<SpoofConfig>(configAtom);
    const modelFile = useAtomValue(modelDataAtom);
    const termData = useAtomValue(termTransferAtom);
    const messageData = useAtomValue(messageTransferAtom);

    // CLOSE HANDLER: whenever a Connection is closed (either via 'eter:close' or network drop),
    // remove that user from your usersAtom.
    usePeerClose((conn?: Connection<EventProtocol>) => {
        if (conn) {
            setUsers((old) => old.filter((user) => user.connectionId !== conn.connectionId));
        }
    });

    usePeerData((data: EventProtocol, conn: Connection<EventProtocol>) => {
        console.log('received data from peer:', data);
        if (data.event === 'eter:alive') {
            const userExists = users.some((u) => u.username === data.user.username);
            if (!userExists && data.user.username) {
                // Auto register on image-event
                setUsers((old) => [
                    ...old,
                    {
                        username: data.user.username,
                        connectionId: conn.connectionId,
                    },
                ]);
                setAllUNs((old) => {
                    if (old.some((u) => u.username === data.user.username)) {
                        return old;
                    }
                    return [...old, { username: data.user.username }];
                });
            }
        } else if (data.event === 'eter:join') {
            // This event is triggered by student before register
            conn.send({
                // We send current configuration
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
                // Also we send current term
                event: 'eter:termData',
                data: {
                    term: termData.term,
                    recipient: { username: 'a' },
                },
            });
            conn.send({
                // And we send list of taken usernames and those that have dropped
                event: 'eter:userlist',
                available: allUNs.filter((u) => !users.some((user) => user.username === u.username)), // Filters users dropped from the users
                taken: allUNs.filter((u) => users.some((user) => user.username === u.username)), // Filters users still connected
            });
        } else if (data.event === 'eter:drop') {
            // not in use
            setUsers((old) => old.filter((o) => o.username !== data.data.username));
        } else if (data.event === 'eter:register') {
            // User has given username (and maybe profile pic too?) and register
            const idx = users.findIndex((u) => u.username === data.data.username);
            if (idx !== -1) {
                // Dublicate user!
                console.log('users have tried to enter with same username. No dublicates allowed.'); // Sends reload command back to same connection
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
                // Only add if there is not already one with same name
                if (old.some((u) => u.username === data.data.username)) {
                    return old;
                }
                return [...old, { username: data.data.username }];
            });
            // If registering with new profilePicture!
            if (data.data.profilePicture && data.data.profilePicture.length > 0) {
                (async () => {
                    if (data.data.profilePicture) {
                        const profilePic = await base64ToCanvas(data.data.profilePicture);
                        setProfilePictures((prev) => {
                            const id = data.data.username;
                            const prevMap = new Map(prev);
                            prevMap.set(id, profilePic);
                            return prevMap;
                        });
                    }
                })();
            } else {
                // If rejoining and there was already profilepic, then we send it back to student
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
                } // TODO: Here is one good place to implement random profile picture if we would like one? Just memo note here..
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
            // On new image from student. This also usually means new score.
            // If peer connection has stability issues, it might drop from active "users" -list and not rejoin it with register
            // In that case we register student also here
            const userExists = users.some((u) => u.username === data.data.studentId);
            if (!userExists && data.data.studentId) {
                // Auto register on image-event
                setUsers((old) => [
                    ...old,
                    {
                        username: data.data.studentId,
                        connectionId: conn.connectionId,
                    },
                ]);
                setAllUNs((old) => {
                    if (old.some((u) => u.username === data.data.studentId)) {
                        return old;
                    }
                    return [...old, { username: data.data.studentId }];
                });
            }
            // If student wishes to remove image, it is done here
            if (data.data.image === 'delete') {
                // Deleting image from results. This does not alter top scores shown in usergrid however!
                setStudent((prev) => {
                    const newData = prev?.students ?? new Map();
                    const studentScores: StudentScores = newData.get(data.data.studentId) ?? { data: new Map() };
                    studentScores.data.delete(data.data.classname);
                    return { students: newData };
                });
            } else {
                // Check and update top-scores
                updateTopScores({
                    classname: data.data.classname,
                    studentId: data.data.studentId,
                    score: data.data.score,
                    topScores,
                    setTopScores,
                });

                // Add image to results (studentDataAtom)
                (async () => {
                    const topCanvas = await base64ToCanvas(data.data.image);
                    const topHeatmap = await base64ToCanvas(data.data.heatmap);
                    const score = data.data.score;
                    // Here we set the image received as current activity of student shown in user grid:
                    setCurrentActivity((prev) => {
                        const id = data.data.studentId;
                        const prevMap = prev ?? new Map();
                        const next = new Map(prevMap);
                        if (data.data.hidden !== 'delete') {
                            next.set(id, {
                                picture: topCanvas,
                                hidden: data.data.hidden,
                            });
                        } else {
                            next.delete(id); // (valinnainen mutta looginen)
                        }
                        return next;
                    });
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
        } // On student image event ends
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
