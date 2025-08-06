import { Connection, ConnectionStatus, usePeer } from '@knicos/genai-base';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { EventProtocol } from './protocol';
import { ImageData, ModelInfo, ModelOrigin, RegisterData } from '../utils/types';
import { useAtom } from 'jotai';
import {
    availableUsernamesAtom,
    configAtom,
    modelAtom,
    profilePictureAtom,
    studentBouncerAtom,
    takenUsernamesAtom,
    termTransferAtom,
    usernameAtom,
} from '../atoms/state';
import { loadModel } from './loadModel';

interface Props extends PropsWithChildren {
    server?: string;
    mycode?: string;
}

interface ProtocolContextType {
    doSendImages?: (data: ImageData) => void; // Send Image + heatmap image
    doRegister?: (data: RegisterData) => void; // Send username and profilepicture
}

const ProtocolContext = createContext<ProtocolContextType>({});

// eslint-disable-next-line react-refresh/only-export-components
export function useSpoofProtocol() {
    return useContext(ProtocolContext);
}
export default function StudentProtocol({ server, mycode, children }: Props) {
    const [config, setConfig] = useAtom(configAtom);
    const [, setTermData] = useAtom(termTransferAtom);
    const [, setAvailableUsernames] = useAtom(availableUsernamesAtom);
    const [, setTakenUsernames] = useAtom(takenUsernamesAtom);
    const [, setModel] = useAtom(modelAtom);
    const [, setBouncer] = useAtom(studentBouncerAtom);
    const [, setProfilePicture] = useAtom(profilePictureAtom);
    const [ownUsername] = useAtom(usernameAtom);
    // conn: Connection<EventProtocol>
    const dataHandler = useCallback(
        async (data: EventProtocol, conn: Connection<EventProtocol>) => {
            if (data.event === 'eter:join') {
                console.log('Join command');
                // Send
            }
            if (data.event === 'ping') {
                console.log('ping');
            } else if (data.event === 'eter:termData') {
                console.log('new termdata:', data.data);
                if (data.data.recipient.username === 'a' || data.data.recipient.username === ownUsername)
                    setTermData(data.data);
            } else if (data.event === 'eter:config') {
                console.log('New config received: ', data.configuration);
                if (data.configuration.modelData) {
                    if (
                        data.configuration.modelData.name !== config.modelData.name ||
                        data.configuration.modelData.origin !== config.modelData.origin
                    ) {
                        if (data.configuration.modelData.origin === 'Gen-AI') {
                            try {
                                const model = await loadModel(data.configuration.modelData);
                                setModel(model);
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
                } catch (err) {
                    console.error('Failed to load model', err);
                } finally {
                    URL.revokeObjectURL(url);
                }
            } else if (data.event === 'eter:messageUser') {
                console.warn(data.message);
                if (!data.recipient || data.recipient.username === ownUsername) {
                    setBouncer({ message: data.message, reload: data.reload });
                }
            } else if (data.event === 'eter:profilePicture') {
                console.log('profilepic received');
                setProfilePicture(data.data.profilePicture);
            }
        },
        [
            setConfig,
            setAvailableUsernames,
            config.modelData,
            setModel,
            setTakenUsernames,
            setBouncer,
            setProfilePicture,
            setTermData,
            ownUsername,
        ]
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
