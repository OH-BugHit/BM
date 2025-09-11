import { Connection, ConnectionStatus } from '@genai-fi/base';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { EventProtocol } from './protocol';
import { ImageData, ModelInfo, ModelOrigin, RegisterData } from '../utils/types';
import { useAtom } from 'jotai';
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
    const [, setTermData] = useAtom(termTransferAtom);
    const [, setAvailableUsernames] = useAtom(availableUsernamesAtom);
    const [, setTakenUsernames] = useAtom(takenUsernamesAtom);
    const [, setModel] = useAtom(modelAtom);
    const [, setBouncer] = useAtom(studentBouncerAtom);
    const [, setProfilePicture] = useAtom(profilePictureAtom);
    const [, setResults] = useAtom(studentResultsAtom);
    const [ownUsername] = useAtom(usernameAtom);
    const [, setLabels] = useAtom(labelsAtom);
    const { i18n } = useTranslation();
    // conn: Connection<EventProtocol>
    usePeerData(async (data: EventProtocol, conn: Connection<EventProtocol>) => {
        if (data.event === 'eter:join') {
            // Send
        }
        if (data.event === 'ping') {
            console.log('ping');
        } else if (data.event === 'eter:termData') {
            if (data.data.recipient.username === 'a' || data.data.recipient.username === ownUsername)
                setTermData(data.data);
        } else if (data.event === 'eter:config') {
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
            if (!data.recipient || data.recipient.username === ownUsername) {
                if (data.action === 'resetResult') {
                    setResults((old) => {
                        const newResults = { ...old };
                        newResults.data.delete(data.message);
                        return newResults;
                    });
                } else if (data.action === 'bouncer') {
                    setBouncer({ message: data.message, reload: data.reload });
                }
            }
        } else if (data.event === 'eter:profilePicture') {
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
