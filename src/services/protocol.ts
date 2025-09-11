import { BuiltinEvent, PeerEvent } from '@genai-fi/base';
import { ImageData, RegisterData, SpoofConfig, SpoofData } from '../utils/types';
import { Username } from '../utils/types';
export interface ConfigurationEvent extends PeerEvent {
    event: 'eter:config';
    configuration: SpoofConfig;
}

export interface ImageEvent extends PeerEvent {
    event: 'eter:image';
    data: ImageData;
}

export interface RegisterEvent extends PeerEvent {
    event: 'eter:register';
    data: RegisterData;
}

export interface CloseEvent extends PeerEvent {
    event: 'eter:drop';
    data: Username;
}

export interface UserListEvent extends PeerEvent {
    event: 'eter:userlist';
    available: Username[];
    taken: Username[];
}

export interface ModelRequestEvent extends PeerEvent {
    event: 'eter:modelRequest';
}

export interface ModelTransferEvent extends PeerEvent {
    event: 'eter:modelTransfer';
    data: Blob;
}

export interface MessageUserEvent extends PeerEvent {
    event: 'eter:messageUser';
    message: string;
    reload: boolean;
    action: 'resetResult' | 'bouncer';
    recipient?: Username;
}

export interface ProfilePictureEvent extends PeerEvent {
    event: 'eter:profilePicture';
    data: RegisterData;
}

export interface TermDataEvent extends PeerEvent {
    event: 'eter:termData';
    data: SpoofData;
}

export interface HeartbeatEvent extends PeerEvent {
    event: 'eter:alive';
    user: Username;
}

export type EventProtocol =
    | BuiltinEvent
    | ConfigurationEvent
    | ImageEvent
    | RegisterEvent
    | CloseEvent
    | UserListEvent
    | ModelRequestEvent
    | ModelTransferEvent
    | MessageUserEvent
    | ProfilePictureEvent
    | TermDataEvent
    | HeartbeatEvent;
