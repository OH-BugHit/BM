import { BuiltinEvent, PeerEvent } from '@knicos/genai-base';
import { ImageData, ScoreData, SpoofConfig } from '../utils/types';
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

export type EventProtocol = BuiltinEvent | ConfigurationEvent | ScoreEvent | ImageEvent;
