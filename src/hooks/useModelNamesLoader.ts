import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { modelListAtom } from '../atoms/state';
import { fetchModelNames } from '../services/loadModelList';

export function useModelNamesLoader() {
    const [modelList, setModelList] = useAtom(modelListAtom);
    const [error, setError] = useState<string | null>(null);
    const retryCount = useRef(0);
    const maxRetries = 10;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const tryLoad = async () => {
            try {
                if (modelList.length === 0) {
                    const loadedList = await fetchModelNames();
                    setModelList(loadedList);
                    setError(null);
                    retryCount.current = 0;
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                retryCount.current += 1;
                if (retryCount.current < maxRetries) {
                    timeoutRef.current = setTimeout(tryLoad, 3000);
                }
            }
        };

        // Käynnistä vain kerran mountissa
        tryLoad();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { error };
}
