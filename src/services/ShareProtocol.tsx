import ClassifierApp from '@genai-fi/classifier';
import { useAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { useCallback, useEffect } from 'react';
import { modelAtom, modelSharedAtom, sessionCodeAtom, shareModelAtom } from '../atoms/state';

const API_BASE_URL = import.meta.env.VITE_APP_API || 'http://localhost:9001';
const SHARE_INTERVAL = 20 * 60 * 1000; // 20 minutes

/**
 * Sends the model to the server for sharing
 * @param code - Session code for identification
 * @param model - The classifier model to share
 */
async function sendModel(code: string, model: ClassifierApp) {
    model.projectId = code;
    const blob = await model.saveComponents();
    if (!blob.zip) {
        console.error('Failed to save model as zip');
        throw new Error('Model save failed - no zip file generated');
    }

    const response = await fetch(`${API_BASE_URL}/model/${code}/`, {
        method: 'POST',
        body: blob.zip,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload model: ${response.statusText}`);
    }

    console.log('Model shared successfully with code:', code);
}

/**
 * Removes the model from the server
 * @param code - Session code for identification
 */
async function unshareModel(code: string) {
    const response = await fetch(`${API_BASE_URL}/model/${code}/`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        console.warn(`Warning: Failed to unshare model: ${response.statusText}`);
    } else {
        console.log('Model unshared successfully');
    }
}

/**
 * ShareProtocol component manages model sharing with a remote server
 *
 * Handles:
 * - Automatic sharing when shareModelAtom is true
 * - Periodic re-sharing every 20 minutes
 * - Model removal when sharing is disabled
 * - Support for GenAI, Remote, and Local models
 */
export default function ShareProtocol() {
    const [share, setShare] = useAtom(shareModelAtom);
    const setModelShared = useSetAtom(modelSharedAtom);
    const code = useAtomValue(sessionCodeAtom);
    const store = useStore();

    const send = useCallback(() => {
        const model = store.get(modelAtom);

        if (model && share && code) {
            console.log('Sharing model with code:', code);
            sendModel(code, model)
                .then(() => {
                    setModelShared(true);
                })
                .catch((err) => {
                    console.error('Failed to share model:', err);
                    setShare(false);
                    setModelShared(false);
                });
        }
    }, [share, setShare, setModelShared, code, store]);

    useEffect(() => {
        if (!code) {
            return;
        }

        // If sharing is enabled, send model and set up periodic re-sharing
        if (share && store.get(modelAtom)) {
            const timer = setInterval(send, SHARE_INTERVAL);
            send();
            return () => clearInterval(timer);
        } else if (!share && store.get(modelAtom) && store.get(modelSharedAtom)) {
            // When sharing ends, remove it from server
            unshareModel(code).catch((err) => {
                console.error('Failed to unshare model:', err);
            });
            setModelShared(false);
        }
    }, [share, send, store, code, setModelShared]);

    return null;
}
