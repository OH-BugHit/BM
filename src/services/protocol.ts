import { BuiltinEvent, PeerEvent } from '@knicos/genai-base';
import { ImageData, ScoreData, SpoofConfig } from '../utils/types';
import { Username } from '../atoms/state';
export interface ConfigurationEvent extends PeerEvent {
    event: 'eter:config';
    configuration: SpoofConfig;
}

export interface ScoreEvent extends PeerEvent {
    event: 'eter:score';
    data: ScoreData;
}

export interface ImageEvent extends PeerEvent {
    event: 'eter:image';
    data: ImageData;
}

export interface RegisterEvent extends PeerEvent {
    event: 'eter:register';
    data: Username;
}

export interface CloseEvent extends PeerEvent {
    event: 'eter:drop';
    data: Username;
}

export interface UserListEvent extends PeerEvent {
    event: 'eter:userlist';
    data: Username[];
}

export type EventProtocol =
    | BuiltinEvent
    | ConfigurationEvent
    | ScoreEvent
    | ImageEvent
    | RegisterEvent
    | CloseEvent
    | UserListEvent;
