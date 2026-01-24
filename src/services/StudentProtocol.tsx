import { Connection, ConnectionStatus } from '@genai-fi/base';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { EventProtocol } from './protocol';
import { ImageData, ModelInfo, ModelOrigin, RegisterData } from '../utils/types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    availableUsernamesAtom,
    configAtom,
    labelsAtom,
    modelAtom,
    profilePictureAtom,
    studentBouncerAtom,
    studentResultsAtom,
    takenUsernamesAtom,
    termTransferAtom,
    topScoreAtom,
    usernameAtom,
} from '../atoms/state';
import { loadLabels, loadModel } from './loadModel';
import { usePeerData, usePeerSender, usePeerStatus } from '@genai-fi/base/hooks/peer';
import { useTranslation } from 'react-i18next';

interface ProtocolContextType {
    doSendImages?: (data: ImageData) => void; // Send Image + heatmap image
    doRegister?: (data: RegisterData) => void; // Send username and profilepicture
}

const ProtocolContext = createContext<ProtocolContextType>({});

// eslint-disable-next-line react-refresh/only-export-components
export function useSpoofProtocol() {
    return useContext(ProtocolContext);
}
export default function StudentProtocol({ children }: PropsWithChildren) {
    const [config, setConfig] = useAtom(configAtom);
    const setTermData = useSetAtom(termTransferAtom);
    const setAvailableUsernames = useSetAtom(availableUsernamesAtom);
    const setTakenUsernames = useSetAtom(takenUsernamesAtom);
    const setModel = useSetAtom(modelAtom);
    const setBouncer = useSetAtom(studentBouncerAtom);
    const setProfilePicture = useSetAtom(profilePictureAtom);
    const setResults = useSetAtom(studentResultsAtom);
    const setTopScore = useSetAtom(topScoreAtom);
    const ownUsername = useAtomValue(usernameAtom);
    const setLabels = useSetAtom(labelsAtom);
    const { i18n } = useTranslation();
    // conn: Connection<EventProtocol>

    usePeerData(async (data: EventProtocol, conn: Connection<EventProtocol>) => {
        console.log('data received', data);
        if (data.event === 'eter:join') {
            // Send
        }
        if (data.event === 'ping') {
            console.log('ping');
        } else if (data.event === 'eter:termData') {
            // Sets the label for the student to classify
            if (data.data.recipient.username === 'a' || data.data.recipient.username === ownUsername)
                setTermData(data.data);
        } else if (data.event === 'eter:config') {
            // Sets configuration of the game, such as model, and pause, heatmap and datasetview allowance.
            if (data.configuration.modelData) {
                if (
                    data.configuration.modelData.name !== config.modelData.name ||
                    data.configuration.modelData.origin !== config.modelData.origin
                ) {
                    if (data.configuration.modelData.origin === 'Gen-AI') {
                        try {
                            const model = await loadModel(data.configuration.modelData);
                            const labels = await loadLabels({
                                language: i18n.language,
                                modelName: data.configuration.modelData.name,
                            });
                            setModel(model);
                            if (labels) {
                                setLabels((old) => {
                                    const newLabels = new Map<string, string>(old.labels);
                                    Object.entries(labels).forEach(([label, translation]) => {
                                        newLabels.set(label as string, translation as string);
                                    });
                                    return { labels: newLabels };
                                });
                            } else {
                                setLabels((old) => {
                                    // Default fallback to model.getLabels!
                                    const newLabels = new Map<string, string>(old.labels);
                                    const labelList = model?.getLabels() ?? [];
                                    labelList.forEach((label) => {
                                        newLabels.set(label, label);
                                    });
                                    return { labels: newLabels };
                                });
                            }
                        } catch (e) {
                            console.error('Failed to load model', e);
                        }
                    } else {
                        conn.send({
                            event: 'eter:modelRequest',
                        });
                    }
                }
            }
            setConfig(data.configuration);
            conn.send({ event: 'eter:alive', user: { username: ownUsername } }); // Alive signal
        } else if (data.event === 'eter:userlist') {
            setAvailableUsernames(data.available);
            setTakenUsernames(data.taken);
        } else if (data.event === 'eter:modelTransfer') {
            // Receives model as zip blob from teacher
            const receivedZip = new Blob([data.data], { type: 'application/zip' });
            const url = URL.createObjectURL(receivedZip);
            const modelLoadingObject: ModelInfo = { origin: ModelOrigin.Local, name: url };
            try {
                const model = await loadModel(modelLoadingObject);
                setModel(model);
                setLabels((old) => {
                    // Default fallback to model.getLabels!
                    const newLabels = new Map<string, string>(old.labels);
                    const labelList = model?.getLabels() ?? [];
                    labelList.forEach((label) => {
                        newLabels.set(label, label);
                    });
                    return { labels: newLabels };
                });
            } catch (err) {
                console.error('Failed to load model', err);
            } finally {
                URL.revokeObjectURL(url);
            }
        } else if (data.event === 'eter:messageUser') {
            // Messages such as reset result for specific term or bouncer (kick / remove user)
            console.log('poistetaan?:', ownUsername);
            if (!data.recipient || data.recipient.username === ownUsername) {
                if (data.action === 'resetResult') {
                    setResults((old) => {
                        console.log(old);
                        const newResults = { ...old };
                        newResults.data.delete(data.message);
                        console.log(newResults);
                        return newResults;
                    });
                    setTopScore(0); // Resetting the topscore for TopScoreSender
                } else if (data.action === 'bouncer') {
                    setBouncer({ message: data.message, reload: data.reload });
                }
            }
        } else if (data.event === 'eter:profilePicture') {
            // For receiving profile picture on reconnect. (Profile picture is not in use currently)
            setProfilePicture(data.data.profilePicture);
        }
    });
    const [hasBeenReady, setHasBeenReady] = useState(false);

    const ready = usePeerStatus() === 'ready';
    const send = usePeerSender<EventProtocol>();

    useEffect(() => {
        setHasBeenReady(true);
    }, [ready]);

    /**
     * Sends heatmap and normal image and score to the teacher
     */
    const doSendImages = useCallback(
        (images: ImageData) => {
            if (send) {
                send({ event: 'eter:image', data: images });
            }
        },
        [send]
    );

    const doRegister = useCallback(
        (registerData: RegisterData) => {
            if (send) {
                send({ event: 'eter:register', data: registerData });
            }
        },
        [send]
    );

    return (
        <ProtocolContext.Provider
            value={{
                doSendImages,
                doRegister,
            }}
        >
            {hasBeenReady && children}
            <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', pointerEvents: 'none' }}>
                <ConnectionStatus
                    api={import.meta.env.VITE_APP_APIURL}
                    appName={'spoofgame'}
                    visibility={1}
                />
            </div>
        </ProtocolContext.Provider>
    );
}
